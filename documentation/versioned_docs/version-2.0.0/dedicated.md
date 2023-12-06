---
title: Hosting & Configuration
---

As mentioned in the [Overview](deployment), this section is meant to guide you through configuring and deploying Prose on a dedicated instance.

## Decide on Where to Host

First, you'll need to answer the following question. Where would you like to host Prose?

While there are many options that vary by project and developer preferences, the simplest way is often to use a cloud provider of your choice.

In the [Lexicon tutorial](tutorial/setup-cloud-server), we walk you through this process using Digital Ocean.

If you're confused about this step, or don't have a preference, you should take some time to work through it.

However, if you already know what you're doing, feel free to use any cloud provider or hosting solution of your choice.

### Hosting Checklist

Once you've decided on a host, go through the checklist below to verify that everything is setup as expected.

#### ✅ Ensure Access & Permissions on the Host

At a minimum, you will need to be able to login to the host. Some cloud providers offer a virtual, web-based terminal, but ideally you can get credentials to login directly.

If your host is in a UNIX-based environment, you should also have permissions to run commands as `sudo`.

A quick way to check this is to simply attempt to run a command with `sudo`:

```sh
$ sudo ls
```

However, if you have a restrictive hosting environment, you will just need a way to place the Lexicon source onto the host, install its dependencies, and expose it on a port.

Bear in mind that a restrictive hosting environment is not ideal, especially since the recommended setup makes use of Docker.

#### ✅ Ensure the Host is reachable in the way you need it

Typically, this means that your host is accessible on the open internet.

However, you might have different constraints, such as only needing the host to be accessible from within a VPN or a local network.

<br />

Once you have setup a host which is reachable in the way you need it to be, you can begin configuring Prose on it.

## Configure & Deploy Prose

### Without Docker

Naturally, setting up Prose without Docker involves more manual steps and can be platform-specific.

We have already covered this approach well in the tutorial. In particular, you can dig in with it on the page, [Setup the Prose GraphQL API](tutorial/install-prose#install-manually)

### With Docker

The Prose Docker image comes preconfigured to run Prose using **[PM2](https://pm2.keymetrics.io/)**, which is a sophisticated toolset for running Node processes in production.

This is typically a reasonable setup, with which you can even expose the PM2 server directly to requests on the host.

However, if you'd prefer a different setup, perhaps using Nginx as a reverse proxy to the Docker container, feel free to modify the Dockerfile to match your requirements.

#### Install Docker

**[Docker](https://www.docker.com/)** is a containerization framework that makes it easy to build, manage, and deploy your application stack in a way that is safer, more reliable, and reproducible across multiple platforms.

There are countless guides available for installing Docker on a given operating system.

Ubuntu is one of the more common operating systems avaiable through most cloud providers.

Docker provides a [full tutorial](https://docs.docker.com/engine/install/ubuntu/) for this, and even provides a convenience script that you can run in two lines:

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Whichever path you need to take, just make sure that Docker is up and running on your host before continuing.

#### Configure Environment Variables

A comprehensive list of all Prose environment variables can be found on the [Environment Variables](env-prose) page.

In brief, at a minimum, you'll want to ensure that `PROSE_DISCOURSE_HOST` is set.

Another variable to pay attention to is `PROSE_APP_PORT`. This defaults to port 80, which instructs Prose to listen on that port.

Depending on your setup, you might want it to listen on a different port.

<br />

#### Build Prose from the Dockerfile

If you'd like to use Docker to manually build Prose, run the following command from the **project root**.

This might be of interest to you if you'd like to make some adjustments to the Dockerfile itself.

Alternatively, if you simply wish to pull the latest Prose build from Docker Hub, you can [skip to the next step](#pulling-the-prose-docker-image).

Unless you've made modifications to the Dockerfile and have it stored elsewhere, you can get started building by running:

```bash
docker build -t prose:latest -f api/deploy/Dockerfile api/
```

The command searches for the `Dockerfile` at `api/deploy/Dockerfile` because we instructed it to look there with the `-f` flag.

Then, it uses `api/` as the context for the build, which allows the references in the `Dockerfile` to resolve correctly.

By passing the `-t prose:latest` tag, it tags the locally built image as the latest build. This can be useful for identifying and managing the images in a Docker environment over time.

#### Pull the Prose Docker Image

If you'd rather just use the latest release of the Prose image, you can simply run:

```
docker pull kodefox/prose:latest
```

#### Run the Prose Docker Container

Next, to run the newly built image, run the following command:

```bash
docker run -d \
    -e PROSE_DISCOURSE_HOST=https://discourse.example.com \
    -e PROSE_APP_PORT=4000 \
    --name prose \
    -p 5000:4000 \
    kodefox/prose:latest
```

:::note
If you built the image by hand, you'll want to substitute `kodefox/prose:latest` with the image name and tag you used, such as `prose:latest`.
:::

To recap, let's briefly break down that command line-by-line

**Run in Detached Mode**

```bash
docker run -d
```

The first line lets Docker know to run the container in **detached mode**.

This means that the command will run in the background, will not be tied to your current session, and will keep running even if you log out.

If you omitted the `-d` flag, Docker would run the container in the foreground, and exiting the process in the foreground would stop the container.

**Set Environment Variables**

```bash
-e PROSE_DISCOURSE_HOST=https://discourse.example.com
-e PROSE_APP_PORT=4000
```

These lines instruct Docker to pass the environment variables of `PROSE_DISCOURSE_HOST` and `PROSE_APP_PORT` to the container when running it.

These are both application-level environment variables that Prose itself will leverage to run properly.

The Docker image expects these values to be set and passes them to the container's environment, which Prose then accesses via `process.env`.

**Name the Container**

```bash
--name prose
```

This line tells Docker to give the running container a name. This makes it easier to identify and interact with via commands, such as:

```bash
docker stop prose
```

**Configure a Port Mapping between the Host and the Container**

```bash
-p 5000:4000
```

Next, we configure Docker with a port mapping, which tells Docker to listen to map the host port of `5000` to the container port of `4000`.

Because we previously set `PROSE_APP_PORT=4000`, this means that all requests to the host at port `5000` will be forwarded to Prose inside of its container on port `4000`.

```bash
kodefox/prose:latest
```

The last line of the command tells Docker which image to use for the container.

Above, if you built the Prose image by hand, it was tagged as `prose:latest`.

If you chose to pull from Docker Hub, this is simply instructing Docker to pull that image if necessary, and then start the container with it.

#### Next Steps

At this point, you should have a Docker container running the Prose server on your host.

However, in terms of preparing your Prose host for production, you aren't quite there yet.

Below, we'll guide you through the last steps, finalizing your deployment of the Prose GraphQL Server.

#### Setup SSL (IMPORTANT)

:::danger
Deploying Prose without SSL in a way that is publicly accessible is **extremely risky**.

Doing so could provide an attacker with full access to your Discourse site and all of its data.
:::

The **most important next-step** to take at this point is to configure an SSL certificate for your Prose host.

The reason this is so important is that, without SSL, Prose's traffic between your users' devices and Discourse is not encrypted.

And this means that attackers can snoop on your users' requests to Prose and Discourse—including, importantly, their authentication information.

To put it bluntly, deploying Prose without configuring SSL is irresponsible and compromises the security of your Discourse instance.

An attacker could even steal your authentication token and use it to access, and potentially destroy, your Discourse site.

##### How to Setup SSL

There are a variety of methods to obtain SSL certificates. Some are free, and some are paid.

The free route involves using [Let's Encrypt](https://letsencrypt.org/), which is very useful, but can require more technical knowledge to setup correctly—depending on your configuration. A key difference is that you need to renew the certificates more frequently.

The paid route involves using a provider like [DigiCert](https://www.digicert.com/) to obtain certificates that take longer to expire.

Either way, you'll end up with certificate files that you can configure and launch your webserver with.

Ideally, at this point, you've already purchased a domain. If you haven't, we'd recommend using a domain provider to get a low-cost domain name.

You could host Prose at a subdomain of your existing Discourse site, like `prose.mydiscoursesite.com`.

Or, you could just get a cheap, nonsense domain, like `purplemonkeydishwasher.tech`—since your users won't typically see it anyway.

Regardless, to emphasize it again, it is **critical** that you don't deploy Prose into production until you have prepared your host to encrypt the traffic from Prose.

#### Determine how you'll expose Prose on the host

When someone navigates to your host which is running Prose, how will their request get routed to Prose?

If you had exposed Prose directly on port 80—NOT recommended—and your host's domain name was `myproseserver.com`, then a user would navigate to `http://myproseserver.com` and be greeted with the [GraphiQL interface](https://www.graphql-yoga.com/docs/features/graphiql).

However, a more common approach is to use a dedicated webserver, such as Nginx or Apache, that acts as a reverse-proxy.

With this approach, the websever listens for all requests on the ports you tell it to, and is configured to route traffic to Prose, which is listening on a non-privileged port, like 8080.

We recommend this approach more highly for the following reasons:

- Existing webservers are generally more reliable and performant
- It allows configuration of an SSL certificate, which is necessary for protecting your users' data

Upon configuring the webserver, you'll need to instruct it to forward traffic to the running Prose server.

Your setup might look something like this:

- Nginx is configured to listen on port 80 and port 443 on your domain, `purplemonkeydishwasher.tech`
- Nginx has located and loaded your SSL certificate files for `purplemonkeydishwasher.tech`
- Nginx is configured to upgrade all requests on port 80 to port 443
- Your Prose server is running inside of Docker on a container port of 80, and exposed to the host on port 8080.
- Your Nginx configuration specifies that requests to `purplemonkeydishwasher.tech` should be forwarded to port 8080.
- Requests come in for `purplemonkeydishwasher.tech`, Nginx routes it to the container running Prose, which handles the requests, and responds.

#### Configure your Cloud Provider's Firewall, if one exists

Ideally, you've configured Prose to be exposed on the open internet with the traffic encrypted over port 443.

Depending on your cloud provider, you may need to go into its settings and expose that port on the firewall.

For example, in DigitalOcean, this involves going to the Networking section, and creating a new firewall rule.

From there, it is fairly simple to add common ports, like 80 and 443, to the firewall.

After that, you simply apply the firewall to your particular instance, and traffic should be allowed through.

#### Configure DNS Settings for your Domain

Provided that you've already registered a domain name, you'll need to configure it so that the domain name points to your host which is running Prose.

Depending on your setup, this will either be done in your domain provider's settings panel, or perhaps within your cloud provider.

Continuing with the DigitalOcean example from above, you can configure your domain provider to point at DigitalOcean's name servers.

This effectively tells your domain provider that DigitalOcean will handle everything for you, and allows you to make adjustments to your domain from within DigitalOcean.

In that case, DigitalOcean makes it seamless to map the domain name to your instance's IP address, and it should then be accessible from the domain name.

Otherwise, you'll want to get the IP address of your host, go into your domain provider, and instruct it that requests to your domain should be direct to your host's IP address.

#### Ready to Go

At this point, your deployed host should be running Prose correctly. When you navigate to the domain name that you configured it with, you should see [GraphiQL](https://www.graphql-yoga.com/docs/features/graphiql), which will allow you to make GraphQL queries against your Discourse instance.

We understand that the details of your deployment can vary quite a bit depending on how you chose to do it.

If you run into any issues with this step—as always—don't hesitate to reach out to us for support.
