---
title: Prepare a Discourse Instance
---

Before you can properly setup Lexicon, you'll need to have a running **[Discourse](https://www.discourse.org/)** instance for Lexicon to interact with.

For this step, you actually have a few options:

#### Option 1: Setup a Local Discourse Instance

The first option is to [setup a development instance](<(#setup-discourse-locally)>) of Discourse locally on your development machine. This takes a bit of time and can get a bit technical.

#### Option 2: Buy a Discourse Instance or Use your Existing One

The second option is to pay to [setup a Discourse instance in the cloud](#setup-discourse-in-the-cloud) as a live, reachable production verison. This is much simpler, but has the obvious tradeoff of costing money.

And perhaps it goes without saying, but if you already have a Discourse site, feel free to just use that.

#### Option 3: Use a Public Discourse Site

The third option is to use an existing Discourse site just to test things out.

As you'll see later on, Lexicon allows you to configure which Discourse site it is pointing at. As such, you can instruct it to point at at a publically accessible Discourse site that you don't personally own.

There are countless examples of active Discourse communities out there. Here are a few examples to choose from:

##### Discourse Meta

[https://meta.discourse.org/](https://meta.discourse.org/)

##### Expo

[https://forums.expo.dev/](https://forums.expo.dev/)

##### The Rust Programming Language

[https://users.rust-lang.org/](https://users.rust-lang.org/)

##### FreeCodeCamp Forums

[https://forum.freecodecamp.org/](https://forum.freecodecamp.org/)

## Setup Discourse Locally

:::note
This section can take a long time. Depending on the specs of your machine, it could take between 10 - 30 minutes to complete.
:::

This section of the tutorial is based on the following post on Discourse: [Beginners Guide to Install Discourse for Development using Docker](https://meta.discourse.org/t/beginners-guide-to-install-discourse-for-development-using-docker/102009).

If you run into any issues, feel free to reference the original post and subsequent discussion.

### Install Docker

**[Docker](https://www.docker.com/)** is a containerization framework that makes it easy to build, manage, and deploy your application stack in a way that is safer, more reliable, and repeatable across multiple platforms.

When developing, building, and testing applications locally, it is an invaluable tool that greatly simplifies the entire process.

The main way that Docker helps us in this tutorial is that it won't require any modifications to our machine's environment other than installing Docker itself.

This is as-opposed to needing to install all of Discourse's dependencies on your physical machine, in a way that may take a lot of effort to undo later.

If you are unsure of how to install Docker, you can follow the instructions on their [website](https://www.docker.com/get-started).

### Clone Discourse

Once Docker is up and running, we can get started with setting up Discourse locally.

The first step is to clone the Discourse repository to your local machine and `cd` into it.

```
git clone https://github.com/discourse/discourse.git
cd discourse
```

Note the repository is on the larger side (nearly 400mb), so this step may take a while depending on your connection.

### Pull, Build, and Start the Discourse Dev Container

:::caution
Make sure that the <u>**host ports**</u> listed below are not already in use on your device.
:::

Discourse already contains a script to help spin up its entire infrastructure using Docker.

During this process, the script will do the following:

- Pull down the necessary "dev" Docker image to bootstrap Discourse
- Build the aforementioned image
- Run the image as a container with multiple ports mapped from your host into the container
  - 127.0.0.1:**1080**->1080/tcp
  - 127.0.0.1:**3000**->3000/tcp
  - 127.0.0.1:**4200**->4200/tcp
  - 127.0.0.1:**9292**->9292/tcp
  - 127.0.0.1:**9405**->9405/tcp
- Prompt you for an admin email address and password

To get started, simply run the following command:

```
$ d/boot_dev --init
```

Note that all of the Docker images add up to about 1GB of disk space usage on your device.

The command will pause when it needs information from you. As shown below, it will prompt you for an administrator email address and password.

```bash
# Output omitted
== 20200804144550 AddTitleToPolls: migrating ==================================
-- add_column(:polls, :title, :string)
   -> 0.0014s
== 20200804144550 AddTitleToPolls: migrated (0.0021s) =========================

Creating admin user...
Email:  me@me.com
Password:
Repeat password:

Ensuring account is active!

Account created successfully with username me
```

Next, it will ask you if you want to make this account an admin account. You do.

```bash
Do you want to grant Admin privileges to this account? (Y/n)  y

Your account now has Admin privileges!
```

Please be aware, as suggested above, that the ports mentioned above are not currently in use by other processes.

### If something unexpected happened

It's possible that something strange may have happened at this step.

Perhaps there was a weird error message, or the process just never displayed the output shown above.

What we'd recommend doing is the following:

#### Check if a Docker container named `discourse_dev` is running

```bash
$ docker ps | grep discourse_dev
CONTAINER ID   IMAGE                            ...     NAMES
dc72a4ead10f   discourse/discourse_dev:release  ...     discourse_dev
```

If it is, stop and remove the container.

```bash
$ docker stop discourse_dev
discourse_dev
$ docker rm discourse_dev
discourse_dev
```

#### Exit or Kill the Existing Process

If the existing process (`d/boot_dev --init`) is still occupying your terminal session, attempt to exit it via `Ctrl + C`.

If the process is not responding to `Ctrl + C` after some time, locate its PID and use `kill -9` to kill it

```bash
$ ps aux | grep rails
user 81254  0.0  0.1 <truncated> discourse_dev bin/rails s

$ kill -9 81254
```

#### Restart Docker or your Machine

Using the command or interface appropriate for your machine, you should restart all of Docker.

On Docker for Mac, this is as simple as going into the tray icon and clicking Restart.

#### Try running the command again

Sometimes things just go a little haywire with this setup. Try running the command again to see if it works better this time.

#### If you're absolutely stuck, reach out.

Don't hestitate to contact us if you're just stuck with this one.

### Optional: Run the Next Two Commands in the Background

You can read on to get an understanding of what the two commands are, but it's worth mentioning that you want them to run simultaneously.

You can do this by _backgrounding_ both processes.

This means that they won't occupy your current session, requiring you to quit them in order to enter other commands.

When you run this command, it will show you the process IDs (PIDs) of the processes that were backgrounded.

To bring them back into the foreground, you can run the `fg` command, and then use `Ctrl + C` or a similar signal to stop them.

```bash
d/rails s & d/ember-cli &
[2] 59786
[3] 59787

fg
```

Just **note** that you won't see the output of the commands, and so you may need to be patient for several minutes until Discourse is reachable at its local address.

Alternatively, you can use the PIDs to kill the processes outright in another session:

```bash
kill -9 59786 59787
```

### Start the Rails Server within the Container

If you hadn't already noticed, Discourse is built in [Ruby](https://www.ruby-lang.org/en/) using the very popular web framework, [Ruby on Rails](https://rubyonrails.org/).

By running the command below, you will be starting the Rails server, which will take some time, and will produce a tremendous amount of output.

In particular, you'll see the database being initialized as the dev container bootstraps the Discourse server.

To get started, simply run the following command.

```
d/rails s
```

#### If you later can't quit the process

**Note** that this command can sometimes hang when you're trying to kill it with `Ctrl + C`.

If that happens, it's recommended that you first stop the Docker container:

```bash
docker stop docker_dev
```

Then, bring the process to the foreground with `fg` if necessary.

Last, either exit your session if possible - such as by closing the Terminal - or find out the PID of the Rails process and kill it directly.

```bash
$ ps aux | grep rails
user 81254  0.0  0.1 <truncated> discourse_dev bin/rails s

$ kill -9 81254
```

### Run the Ember CLI

The above section mentioned Ruby on Rails, which handles the backend aspects of the Discourse application.

However, the Discourse frontend is build in [EmberJS](https://emberjs.com/), which is a batteries-included frontend web framework used by multiple major companies.

Run the command below to instruct the Ember CLI to start the Discourse frontend.

```
d/ember-cli
```

Once you have done this, you'll be able to access Disourse at [http://localhost:4200](http://localhost:4200).

Please note that the output of this command can be a bit confusing. And at times, it can seem like nothing is happening.

You may see several progress indicators, as well as blank output, for several minutes before the server is ready.

The output you're looking for will resemble the following:

```bash
Build successful (72475ms) – Serving on http://localhost:4200/

Slowest Nodes (totalTime >= 5%)                                       | Total (avg)
----------------------------------------------------------------------+------------------
Babel: discourse (2)                                                  | 31501ms (15750 ms)
ember-auto-import-analyzer (11)                                       | 10418ms (947 ms)
Bundler (1)                                                           | 6119ms
Babel: @ember/test-helpers (2)                                        | 5075ms (2537 ms)
broccoli-persistent-filter:TemplateCompiler (3)                       | 4596ms (1532 ms)
```

## Setup Discourse in the Cloud

There are several guides with instructions on how to setup Discourse in the Cloud.

Rather than writing another one, we have found our favorite one and would like to send you over to them to give you a proper walkthrough of the process.

### Guide by SSDNodes

The guide is provided by the [SSDNodes](https://www.ssdnodes.com/?e=blog&q=more-about-ssdnodes) Blog, [Serverwise](https://blog.ssdnodes.com/blog/).

If you aren't familiar, [SSDNodes](https://www.ssdnodes.com) is an excellent, cost-effective VPS hosting provider.

While we are most familiar with Digital Ocean, we'd strongly encourage you to check them out as an alternative for hosting Discourse.

The post, titled [How To Install Discourse On Ubuntu](https://blog.ssdnodes.com/blog/install-discourse/), is written by [Joel Hans](https://blog.ssdnodes.com/blog/author/joel/).

Joel has written an excellent guide. He'll take you through the entire process, including making update to your Discourse instance.

If you find yourself stuck, or have any questions, feel free to reach out to us.

## Use a Public Discourse Site

If you've chosen this option, there's not much to do other than to note the URL of the Discourse site you'll be using.

Once you have that written down somewhere, you're ready for the next section.
