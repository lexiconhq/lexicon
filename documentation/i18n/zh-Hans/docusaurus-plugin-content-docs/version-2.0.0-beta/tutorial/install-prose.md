---
title: Setup the Prose GraphQL API
---

Now that we have a running Discourse instance to interact with, we can move onto setting up the Prose GraphQL Server.

To recap, Prose is a part of the Lexicon stack.

It is responsible for providing a [GraphQL](https://graphql.org/) interface on top of Discourse, which the Lexicon Mobile App can then interact with.

For more information about this, check out [Concepts & Architecture](../concepts).

## Approaches for Setting Up Prose

If your Discourse instance is running locally, it is natural that you should also setup your Prose server locally.

Otherwise, it would be unnecessary extra work to get a remote Prose server communicating with your local Discourse server.

However, if you've setup your Discourse instance in the cloud, it is up to you if you want to run your Prose server locally or in the cloud as well.

If you'd like to install it in the cloud, you'll want to setup an additional server - similar to how you would set one up for Discourse. If you're not yet comfortable with this, feel free to jump back to the page, [Setup a Cloud Server (Optional)](setup-cloud-server).

Bearing all of that in mind, once you have identified where you'd like to host Prose, you should also consider how you'd like to install it onto that machine.

The first way, which we recommend, is to use **[Docker](https://www.docker.com/)**.

And of course, the second way is to install it manually, rather than using containers.

## Install Prose using Docker

The reason we recommend using Docker is because you won't have to worry about setting up Prose's on your machine.

We have already published Prose to [Docker Hub](https://hub.docker.com/), which means you can easily pull it down and run it. We'll guide you through that below.

### Install Docker

First, just as was necessary for setting up Discourse, you'll want to make sure Docker is installed on your machine.

You can follow the instructions on the [Docker installation page](https://www.docker.com/get-started) if you are unsure of how to do this.

### Pull and Run the Prose GraphQL API Image

After successfully installing Docker, you can use the command below to run the Prose GraphQL image.

Just bear in mind that you'll want to adjust some of the **environment variables** to your situation before you run the command.

```
$ docker run -d \
  -e PROSE_DISCOURSE_HOST=https://meta.discourse.org \
  -e PROSE_APP_PORT=80 \
  -p 5000:80 \
  --name prose-graphql \
  kodefox/prose
```

The above command will take care of pulling the Prose GraphQL Docker Image, building it, and running it in a container.

To help understand everything that's going on there, let's break it down line by line.

```bash
docker run -d
```

This instructs Docker to run our image as a container in **detached mode**. This is similar to backgrounding a process.

```bash
-e PROSE_DISCOURSE_HOST=https://meta.discourse.org
-e PROSE_APP_PORT=80
```

The `-e` flag instructs Docker that we want to set or override certain environment variables in the container with the values we provided.

In this case, we're telling Prose to interact with the Discourse instance is running at `https://meta.discourse.org`, and that Prose should run itself _inside of the container_ on a port of `80`.

```
-p 5000:80
```

Next, we're telling Docker what ports we want to map from our host machine into the container.

In the previous step, we established that Prose will run internally on port 80. With the above command, we're telling Docker to expose the container's port 80 as port 5000 on our host.

This means that Prose will be reachable on port 5000 of the host.

So, if you're running this locally, you'll be able to interact with Prose at `http://localhost:5000`.

And if you're running it in the cloud on a domain like `https://prose.mydiscussions.com`, you'd likely want it to be listening on port 443 so the user doesn't have to enter a port number as part of the URL.

### Configure Prose

As suggested above, you can configure Prose through the use of environment variables.

You can find a comprehensive list of all environment variables on the Prose [Environment Variables](../env-prose) page.

In this case, you really only need to set a value for `PROSE_DISCOURSE_HOST`, which will instruct Prose which Discourse instance you'd like it to interact with.

Additionally, if you'd like to set a different port mapping, you can adjust the `-p` flag of the `docker run` command to something else, such as:

```bash
-p 8080:80
```

## Install Manually

This section, whether being done locally or remotely on a cloud provider, will require you to install and configure the necessary dependencies to build and run Prose from scratch.

### Setup Development Machine

If you haven't already, setup your machine for Prose development. You can do so by following the guide at [Setup your Development Machine](setup).

By the time you're done with this step, you should have a local copy of the Lexicon repository on your desired machine.

### Configure Environment Variables

The Prose GraphQL API, at a bare minimum, requires you to provide a URL to an accessible Discourse instance in order to run properly.

Because we're doing this manually, you'll need to specify this in a different way than you would for Docker.

Later on, once you've built Prose, one way you can specify this is to simply provide it inline as you launch the server.

```bash
PROSE_DISCOURSE_HOST=https://discourse.mysite.com node lib/index.js
```

However, you might find it more ergonomic to leverage the support we've setup for `.env` files.

The entire Prose codebase lives in the `api/` directory of the repository, so get started by navigating there from the project root.

```
$ cd api/
```

Next, you'll need to create a `.env` file. Simply copy the template file, `.env.example` into the `.env` file using the following command.

```
$ cp .env.example .env
```

After that, as you'd expect, you want to adjust the `.env` file so that it contains the values specific to your project.

```bash
PROSE_DISCOURSE_HOST=<Valid URL to your Discourse instance>
PROSE_APP_PORT=<Desired port number to listen on>
```

As was covered in the Docker section above, you can find a comprehensive list of all environment variables on the Prose [Environment Variables](../env-prose) page.

### Launch the Prose GraphQL API

:::info
At this point, you should already have all the project's dependencies installed.

If you encounter any errors about missing packages, go back to the guide at [Setup your Development Machine](setup).
:::

If you'd just like to launch Prose to check it out quickly, you can simply run (from the `api/` directory):

```bash
$ npm run dev
```

This will prepare and spin up Prose in a way that isn't ideal for production.

If you wish to run the Prose GraphQL API in the background as a process, there are multiple solutions.

One method is to use **[Tmux](https://github.com/tmux/tmux)**, which will detach the process from the terminal, allowing you to close it and keep Prose running.

Another method is to use **[PM2](https://pm2.keymetrics.io/)**, which is a sophisticated toolset for running Node processes in production.

#### Using Tmux

**Tmux** can be used to detach processes from their controlling terminals, allowing sessions to remain active without being visible.

To get started, install `tmux` on your machine.

If you are unsure of how to install tmux, you can follow the instructions on [this page](https://github.com/tmux/tmux#installation).

Once it's installed, launch it as follows:

```bash
$ tmux
```

Then you can run Prose in the same way as before.

```bash
$ npm run dev
```

If you want to detach from your current session, press `Ctrl + B` then press `d` on your keyboard. The session will remain active in the background.

And if you wish to re-attach to your last session, run the following command.

```
$ tmux a
```

If you want to learn more about the tmux command, check out [this cheat sheet](https://tmuxcheatsheet.com/).

#### Using PM2

Another way to run Prose in the background is to use **pm2** (process manager for NodeJS).

First, as you'd expect, you'll need to install `pm2` on your machine.

```
$ npm install -g pm2
```

Once it's installed, you'll also need to use `pm2` to install [Typescript](https://typescriptlang.org/).

This is because Prose is written in Typescript, and this allows PM2 to run the Typescript files directly for us (as opposed to transpiling them and outputting them as JS first).

To do this, simply run the following command:

```
$ pm2 install typescript
```

After that, you can now launch the Prose GraphQL API in the background with:

```
$ pm2 start src/index.ts
```

To list all running applications, run the following command.

```
$ pm2 list
```

These are some of the frequently used commands.

```
$ pm2 stop     <app_name|namespace|id|'all'|json_conf> # To stop a process
$ pm2 restart  <app_name|namespace|id|'all'|json_conf> # To restart a process
$ pm2 delete   <app_name|namespace|id|'all'|json_conf> # To delete a process
```

## Test the GraphQL API

Now that you've successfully launched Prose, you can actually interact with it in your web browser.

Because of the libraries that we leveraged in building Prose, it automatically comes with [GraphiQL](https://www.graphql-yoga.com/docs/features/graphiql).

This is an in-browser GraphQL IDE that makes it easy to explore the documentation and the schema of the GraphQL API.

In order to access it, you'll need to make note of the host and port number that you configured the API with.

For example, if you launched Prose from your local machine on port 5000, you'd navigate to [http://localhost:5000](http://localhost:5000).

Similarly, if you set it up in the cloud, and all you have is an IP address with Prose listening on port 80, you would navigate to something like [http://174.31.92.1](http://174.31.92.1).

Once the [GraphiQL](https://www.graphql-yoga.com/docs/features/graphiql) interface loads, you can test out some example queries and mutations, including logging into Discourse through Prose.

### Login

:::info
If you're accessing a private Discourse site, you'll need to make note of the token that is returned to make other requests. See below.
:::

```
mutation Login {
  login(email: "user@lexicon.com", password: "user_password") {
    ... on LoginOutput {
      token
      user {
        id
        name
        username
        avatarTemplate
      }
    }
  }
}
```

As mentioned in the notice, if you're interacting with a private Discourse site, you'll need to provide a token for other GraphQL requests.

As part of the response for the above mutation, you'll notice a "token" field which contains your authentication token in Base64.

You use this token in other queries and mutations by opening the HTTP Headers section on the bottom left-hand side of the page.

This section expects JSON, with which you'll want to add an Authorization header that contains your token.

```json
{
  "Authorization": "<token>"
}
```

Once you have done that, you can make authenticated GraphQL queries and mutations as the user you logged in with.

### User Profile

```
  query UserProfile {
    userProfile(username: "john_doe") {
      user {
        ... on UserDetail {
          id
          avatarTemplate
          username
          name
          websiteName
          bioRaw
          location
          dateOfBirth
          email
        }
      }
    }
  }
```

### Topic Detail

```
query TopicDetail {
  topicDetail(topicId: 1) {
    id
    title
    views
    likeCount
    postsCount
    liked
    categoryId
    tags
    createdAt
    postStream {
      posts {
        id
        topicId
        userId
        name
        username
        avatarTemplate
        raw
        createdAt
      }
      stream
    }
    details {
      participants {
        id
        username
        avatarTemplate
      }
    }
  }
}
```

### Logout

```
  mutation Logout {
    logout (username: "john_doe")
  }
```
