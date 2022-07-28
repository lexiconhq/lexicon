---
title: Development Setup
---

### Clone the Lexicon Repository

If you haven't already, make sure you clone the Lexicon repository from Github.

We walk you through this process in [Quick Start Installation](quick-start), so head over there to get started.

### Setup a Discourse Instance, if necessary

In order to get started developing against the Lexicon Stack, you'll need a running Discourse instance.

To recap, the Lexicon Stack consists of:

- The Lexicon Mobile App
- The Lexicon Prose GraphQL API
- A running Discourse instance

Without a Discourse instance, the Prose GraphQL API has nowhere to retrieve data from. And when the Prose GraphQL API can't retrieve any data, the Lexicon Mobile App won't be able to receive anything either.

For detailed instructions on setting up a local development instance of Discourse, head over to the [tutorial](./tutorial/setup-discourse), which will walk you through the process.

However, if you already have a deployed instance of Discourse, we'd recommend using that instead.

### Configure Environment Variables

The Lexicon Stack requires multiple environment variables in order to properly interact with your Discourse server.

In order to run the components of Lexicon, it's recommended that you create and populate `.env` files in two locations within the project:

- `api/` (the GraphQL API server)
- `frontend/` (the React Native app)

To simplify this process, both directories contain a template file, `.env.example`, which you can copy into `.env` files for each directory:

```
$ cp frontend/.env.example frontend/.env
$ cp api/.env.example api/.env
```

#### Frontend Environment Variables

:::note
If the Lexicon Mobile App is already running through Expo, and you adjust these values, you may need to **quit the Expo process and relaunch it** in order to run the Mobile App with the latest values from `frontend/.env`.

If this does not help, try clearing the cache from the frontend directory via `expo r -c`.
:::

Change the value of `MOBILE_PROSE_HOST` in `frontend/.env` to the hostname of your Prose GraphQL API—whether local or already deployed somewhere.

In the first case, this would look like:

```bash
MOBILE_PROSE_HOST=http://localhost
MOBILE_PROSE_PORT=8080
```

Alternatively, for a deployed instance, it would look like:

```bash
MOBILE_PROSE_HOST=https://prose.mysite.com
```

#### Prose GraphQL API Environment Variables

The Prose GraphQL API is fairly simple in terms of configuration. In the simplest case, it only needs to know where your Discourse instance is accessible at.

```
PROSE_DISCOURSE_HOST=https://meta.discourse.org
```

However, it is also worth noting that you can optionally configure the **Hostname** and **Port Number** that the Prose server listens on, which default to **localhost** and **port 80**, respectively.

```
PROSE_DISCOURSE_HOST=https://meta.discourse.org

# Instruct Prose to broadcast publicly instead of on localhost
PROSE_APP_HOSTNAME=0.0.0.0

# Instruct Prose to listen on port 8080 instead of the default port 80
PROSE_APP_PORT=8080
```

For a comprehensive list of all environment variables that can be used to configure Prose, check out [Prose Environment Variables](env-prose).

#### Development Scenarios

When developing locally, there are at least three scenarios that you may find yourself in.

Depending on which one applies to you, the config values across `frontend/.env` and `api/.env` may need to be set differently.

##### Scenario 1: Existing Prose Deployment

If you've already deployed the Prose GraphQL API to a host that is publicly reachable, you will have already setup `api/.env` to the proper values.

In that case, `frontend/.env` only needs updated to point at the deployed GraphQL API.

For example:

```
MOBILE_PROSE_HOST=https://my-deployed-graphql.api
```

##### Scenario 2: Run Prose Locally & Access from a Simulator

This approach involves running both the Lexicon Mobile App and the Prose GraphQL API on your development machine. It is accomplished by instructing Expo to launch the Mobile App in the Android or iOS simulator.

When developing in this way, you can simply set `MOBILE_PROSE_HOST` to `localhost` or `http://127.0.0.1` in both `api/.env` and `frontend/.env`.

Instructing the GraphQL API to listen on `localhost` or `http://127.0.0.1` ensures that others on the same network as your development machine cannot access it. Because the simulator is running on the same device, it should be able to access the GraphQL API.

##### _Brief Note about the Android Simulator_

The Android Simulator is actually unable to access your development machine's network on `http://locahost`.

However, we have accounted for this in our business logic when preparing environment variables.

If you run into issues here, take a look at the function, `getProseEndpoint`, in `frontend/src/constants/app.ts`

Feel free to adjust it to work more properly with your setup.

If you're still running into issues with this, please reach out to us on Github. We'd love to make this more robust if we missed a use-case.

##### Scenario 3: Run Prose Locally & Access from your Mobile Device

It can be very useful to develop and debug against the app using your actual mobile device with the [Expo Go app](https://expo.dev/client).

In order to do this, you'll need to have your development machine reachable from your mobile device.

A simple way to make it reachable is to ensure that your mobile device and development machine are on the same network, and then, in `api/.env`, set `MOBILE_PROSE_HOST` to `0.0.0.0`.

Next, you'll need to update the `MOBILE_PROSE_HOST` value in `frontend/.env` so that the Lexicon app running on your mobile device knows how to reach the GraphQL API running on your development machine.

In order to do this, you'll need to find out what the **local IP address** of your development machine is on your current network.

Note that your local IP address is different from your public IP Address.

If you are not sure how to get your local IP address, you can go to [What Is My Browser: Detect Local IP Address](https://www.whatismybrowser.com/detect/what-is-my-local-ip-address) and follow the instructions.

You will be given an IP address like `10.0.12.121` or `192.168.17.69`.

You can then update the value of `MOBILE_PROSE_HOST` in `frontend/.env` to your local IP address.

This will allow the app running on your mobile device to properly locate the GraphQL API running on your development machine.

## Configure your Discourse Host

As mentioned above, you'll need to have setup a Discourse host for the Lexicon Stack to interact with.

We'd like to briefly cover the different approaches to setting up a Discourse Host for development before continuing.

**1. Run a Discourse Instance Locally**

:::note
Ensure that you are managing all of your ports correctly.

The development setup of Discourse with Docker makes use of multiple ports, one of which being **port 3000** by default. You'll want to double-check that none of the environment variables are pointing at the ports Discourse is using.
:::

If you'd like to run a Discourse site for development locally, the recommended way to do this to use **[Docker](https://www.docker.com/)**, so make sure you have it installed.

Then, as we mentioned above, you can follow [these steps in the tutorial](tutorial/setup-discourse) to install and run a development instance of Discourse in Docker.

**2. Use try.discourse.org or another popular Discourse site**
:::info
Feel free to use existing public Discourse sites—such as the [Docker Community Forum](https://forums.docker.com/) or the [Rust Programming Language Forum](https://users.rust-lang.org/)—in order to test out the Lexicon Mobile App.

Just be mindful of how you're contributing to those sites if you do.
:::

[Try Discourse](https://try.discourse.org/) is a publicly accessible Discourse instance which is intended for testing. As such, it resets every day.

The only drawback of this approach is that you can only register as a normal user, and therefore cannot modify the site's admin settings.

With this approach, you'd simply configure Prose in `api/.env` to point `PROSE_DISCOURSE_HOST` at one of these instances.

## Working with the Codebase

Now that you've prepared everything for development, you can start digging in on the Lexicon codebase.

### Run the Lexicon Mobile App & Prose GraphQL Server

You can run the Mobile App and test it out with a local Prose server by running this command from the project root:

```
$ npm run dev
```

This will simultaneously launch two processes:

- The GraphQL API Server
- The local Expo dev server, which will enable you to launch the React Native app from your device

However, if you wish to run the frontend and backend seperately, execute the following command in a terminal to run the frontend

```
$ npm run --prefix frontend start
```

Then execute the following line in another terminal to run the backend

```
$ npm run --prefix api dev
```

### Debugging

- Use [Expo Developer Menu](https://docs.expo.io/workflow/debugging/#developer-menu) to make the debugging process easier.

Opening the Expo Developer Menu depends on your device:

- On an iOS Device: Shake the device, or touch 3 fingers to the screen.
- On the iOS Simulator: Hit `⌘ + ctrl + Z` on a Mac in the emulator.
- On an Android Device: Shake the device vertically, or run `adb shell input keyevent 82` in the terminal window if the device is connected via USB.
- On the Android Emulator: Hit `⌘ + M`, or run `adb shell input keyevent 82` in your terminal window.

- If your changes don't show up, it could involve a cache issue. In this case, you should try restarting Expo.
  - To do so, quit the process by hitting `Ctrl + C` in the Terminal where it is running.
  - Then run `npm run start` again.
  - If the issue persists, you should look for the latest guidance from Expo on how to clear the cache, as it has been known to change.

### Running the Test Suites

Before running tests, double-check that your changes don't contain any errors.

You can run tests across both the frontend and backend codebases sequentially by running the following command from the project root:

```
$ npm run test
```

On top of ensuring that all tests have passed, the command will also notify you if there are any type errors or issues from Prettier or ESLint.

Also note that the process of testing the frontend involves an additional action.

This step creates a new folder, `frontend/generated`, which contains all the GraphQL Query and Mutation types for use in the codebase.

If we did not run this before the tests, the tests would fail due to type errors.

### Build & Publish the Lexicon Mobile App

:::note
An Expo account is required in order to use Expo's services. You can create one here: https://expo.io/signup.
Once you have created your Expo account, please ensure that you are signed in with your current shell session, via `expo login`.
:::

You can build the Mobile App via Expo by running command below:

```
$ expo publish
```

When you do this, the packager will minify all your code and generate two versions of your code—one for iOS, and one for Android—and then upload them both to the Expo CDN.

Additionally, if you haven't yet optimized the app's assets, Expo will ask you if you'd like to do so.

This has the same effect as manually running `npx expo-optimize` beforehand. It simply compresses all of the image assets in your project to reduce the size of your build.

When the process has completed, you'll be presented with a link, resembling https://exp.host/@ccheever/an-example.

At this point, anyone can then use that link to load your project.

#### Updates

If you later want to deploy an update to your version of the Lexicon Mobile App, you can follow the steps above again in order to publish.

Once published, the new version will be available to your users the next time they open it.

For more details on this process—including publishing to the App Store and Google Play Store—follow the instructions in [Publishing your App](publish-app).

#### Configure the GraphQL API with Your Discourse Server

In order for a published version of the app to be able to contact your Discourse server, you'll need to ensure that:

- The GraphQL API is deployed and running properly on a host that is reachable from the app itself.
- The GraphQL API is configured to point at the correct host and port of your Discourse server
- Your Discourse server is reachable by the GraphQL API
