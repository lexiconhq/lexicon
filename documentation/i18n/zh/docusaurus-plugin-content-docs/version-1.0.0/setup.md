---
title: Development Setup
---

### Clone the Lexicon Repository

If you haven't already, make sure you [clone the Lexicon repository](quick-start#installation) from Github.

### Setup a Discourse Instance, if necessary

In order to get started developing against the Lexicon Stack, you'll need a running Discourse instance.

To recap, the Lexicon Stack consists of:

- The Lexicon Mobile App
- The Lexicon Prose GraphQL API
- A running Discourse instance

Without a Discourse instance, the Prose GraphQL API has nowhere to retrieve data from. And when the Prose GraphQL API can't retrieve any data, the Lexicon Mobile App won't be able to receive anything either.

For detailed instructions on setting up a local development instance of Discourse, head over to the [tutorial](./tutorial/setup-discourse), which will walk you through the process.

However, if you already have a deployed instance of Discourse, we'd recommend using that instead.

### Configuration

The [Lexicon Stack](concepts#architecture-of-the-lexicon-stack) requires some configuration in order to properly interact with your Discourse server.

This involves configuring both the backend GraphQL API, which interacts with your Discourse instance; as well as the frontend Mobile App, which interacts with the GraphQL API.

The architecture of this setup is depicted in [Architecture of the Lexicon Stack](concepts#architecture-of-the-lexicon-stack).

#### Backend GraphQL API Configuration

The [Prose GraphQL API](concepts#prose-discourse-through-graphql) is fairly simple in terms of configuration. In the simplest case, it only needs to know where your Discourse instance is accessible at.

It receives its configuration via a [`.env` file](https://www.codementor.io/@parthibakumarmurugesan/what-is-env-how-to-set-up-and-run-a-env-file-in-node-1pnyxw9yxj) in the root of the `api/` directory.

Here is the simplest configuration of the `api/.env` file:

```
PROSE_DISCOURSE_HOST=https://meta.discourse.org
```

It is also worth noting that you can optionally configure the **Hostname** and **Port Number** that the Prose API server listens on, both of which default to **localhost** and **port 80**, respectively.

```
PROSE_DISCOURSE_HOST=https://meta.discourse.org

# Instruct Prose to broadcast publicly instead of on localhost
PROSE_APP_HOSTNAME=0.0.0.0

# Instruct Prose to listen on port 8929 instead of the default port 80
PROSE_APP_PORT=8929
```

For a comprehensive list of all environment variables that can be used to configure Prose, check out [Prose Environment Variables](env-prose).

#### Frontend Mobile App Configuration

:::note
In the original release of Lexicon, the **Prose URL** was specified in `frontend/.env`. However, as part of migrating to Expo's EAS feature, we centralized the configuration into `frontend/Config.ts` to save you the trouble of needing to maintain it in more than one place, as suggested in the [Expo documentation](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)
:::

To configure the frontend mobile app, you'll first need to set your app name and slug in `frontend/app.json`. The [slug](https://docs.expo.dev/workflow/glossary-of-terms/#slug) is used as part of the URL for your app on Expo's web services, so it is recommended to use kebab-case (e.g., `my-lexicon-app`).

Replace these placeholders with your desired values:

```json
    "name": "<your app name>",
    "slug": "<your app slug>",
```

Next, change the value of `proseUrl` in `frontend/Config.ts` to the URL of your Prose GraphQL API—whether local or already deployed somewhere.

```ts
const config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://preview.myserver.com:8080/subpath',
    },
    production: {
      proseUrl: 'https://myserver.com/api/prose',
    },
  },
};
```

`localDevelopment.proseUrl` will be used during development when you run the app using `npm run start` or `expo start`, whereas the specific value within `buildChannels` (e.g., `production.proseUrl`) will be used when actually building the app.

#### Development Scenarios

When developing locally, there are at least three scenarios that you may find yourself in.

Depending on which one applies to you, the config values across `frontend/Config.ts` and `api/.env` may need to be set differently.

##### Scenario 1: Existing Prose Deployment

If you've already deployed the Prose GraphQL API to a host that is publicly reachable, you will have already setup `api/.env` with the proper values.

In that case, `frontend/Config.ts` only needs updated to point at the deployed GraphQL API.

For example:

```ts
const config = {
  localDevelopment: {
    proseUrl: 'https://my-deployed-graphql.api',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://my-deployed-graphql.api',
    },
    production: {
      proseUrl: 'https://my-deployed-graphql.api',
    },
  },
};
```

In the example above, we have configured the app to point at `https://my-deployed-graphql.api` in all scenarios, including during development when running with `npm run start`.

##### Scenario 2: Run Prose Locally & Access from a Simulator

This approach involves running both the Lexicon Mobile App and the Prose GraphQL API on your development machine. It is accomplished by instructing Expo to launch the Mobile App in the Android or iOS simulator.

When developing this way, you can simply set `localDevelopment.proseUrl` to `http://localhost` in `frontend/Config.ts`. And then in `api/.env`, you can set `PROSE_APP_HOSTNAME` to `0.0.0.0`.

Note that if you want to run Prose locally on a specific port, you would need to make sure that the configuration in both `api/.env` and `frontend/Config.ts` reflect that correctly.

:::caution
If you configure `PROSE_APP_HOSTNAME` in `api/.env` to only listen on `localhost` or `127.0.0.1` (rather than `0.0.0.0`), it prevents others on the same network as your development machine from accessing it. This includes both your mobile device and the Android simulator, which can lead to connectivity issues when developing locally.
:::

##### Scenario 3: Run Prose Locally & Access from your Mobile Device

It can be very useful to develop and debug against the app using your actual mobile device with the [Expo Go app](https://expo.dev/client).

In order to do this, you'll need to have your development machine reachable from your mobile device.

A simple way to make it reachable is to ensure that your mobile device and development machine are on the same network, and then, in `api/.env`, set `PROSE_APP_HOSTNAME` to `0.0.0.0`.

In a regular Expo project, you would be required to update the `localDevelopment.proseUrl` value in `frontend/Config.ts` to contain the hardcoded IP address of your development machine on your network.

However, by setting the value to `http://localhost`, we handle this **automatically** by default, so you don't have to worry about it. Read more about it [here](env-mobile#infer_development_host).

###### Hardcoding your local IP Address

:::info
This approach is not ideal. If your local IP address ever changes, you'll need to locate it again, and update `Config.ts` to reflect that. For this reason, it's preferable to just use `http://localhost`.
:::

To manually instruct the Mobile App how to locate your development machine, you'll need to find out what the **local IP address** of your development machine is on your current network.

Note that your local IP address is different from your public IP Address.

If you are not sure how to get your local IP address, you can go to [What Is My Browser: Detect Local IP Address](https://www.whatismybrowser.com/detect/what-is-my-local-ip-address) and follow the instructions.

The website itself may not be able to automatically detect your local IP address, but it will give you instructions on how to locate it within your specific operating system.

You will be given an IP address like `10.0.12.121` or `192.168.17.69`.

You can then update the value in `frontend/Config.ts` to your local IP address.

This will allow the app running on your mobile device to properly locate the GraphQL API running on your development machine.

## Configure your Discourse Host

As mentioned above, you'll need to have setup a Discourse host for the GraphQL API to interact with.

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

```bash
PROSE_DISCOURSE_HOST=https://try.discourse.org
```

## Working with the Codebase

Now that you've prepared everything for development, you can start digging in on the Lexicon codebase.

### Run the Lexicon Mobile App & Prose GraphQL Server

You can run the Mobile App and test it out with a local Prose server by running this command **from the project root**:

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

On top of ensuring that all tests have passed, the command will also notify you if there are any Typescript errors or issues from Prettier or ESLint.

Also note that the process of running `npm run test` triggers an additional action in the frontend to take place before running the tests.

A new folder, `frontend/generated`, is created and populated with all the GraphQL Query and Mutation types for use in the codebase.

If we did not run this before the tests, they would fail due to type errors.

### Build & Publish the Lexicon Mobile App

:::note
An Expo account is required in order to use Expo's services. You can create one here: https://expo.io/signup.
Once you have created your Expo account, please ensure that you are signed in with your current shell session, via `expo login` or `eas login`.
:::

You are required to configure EAS build first by running:

```bash
eas build:configure
```

You will then get a prompt from the EAS CLI related to the EAS project IDs: `android.package` and `ios.bundleIdentifier`. EAS will provide you with an existing project ID if you have one or ask you to create a new one. As for `android.package` and `ios.bundleIdentifier`, you can specify those values with `com.companyname.appname`, or any other patterns you might prefer.

Once you're done, verify the `proseUrl` value you will use for the actual build of the app in `Config.ts`.

:::info
When publishing your app, it is necessary to deploy Prose somewhere publicly accessible, perhaps on a cloud hosting provider like AWS or DigitalOcean. If Prose is only running on your local machine, users that download your app won't be able to use it.
Check [the documentation](deployment) to deploy Prose if you haven't already.
:::

Now you can build the Mobile App via Expo (EAS) with the preview build profile by running command below:

```bash
eas build –platform all –profile preview
```

When you do this, the packager will minify all your code and generate two versions of your code—one for iOS, and one for Android—and then upload them both to the Expo CDN.

Additionally, if you haven't yet optimized the app's assets, Expo will ask you if you'd like to do so.

This has the same effect as manually running `npx expo-optimize` beforehand. It simply compresses all of the image assets in your project to reduce the size of your build.

When the process is complete, you'll be presented with a shareable QR Code and a URL resembling https://exp.host/@ccheever/an-example, which directs you to the build details in Expo's web console.

At this point, anyone can then use that link to load your project.

For Android, you can install the app on an emulator or on your physical device. However, for iOS, you can only install it on the iOS simulator. To run the app on a real iOS device, follow the steps in [this part](tutorial/building#1-preview) of the tutorial.

When building your app, it is recommended to build it as a preview build first, and make sure everything runs well before building it for release with the production profile.

To build the app with the production build profile, run this command:

```bash
eas build –platform all –profile production
```

You will also be presented with links directing you to the build details in Expo.

However, unlike the preview build, the release build cannot be installed directly on your physical device or in an emulator / simulator. You'll need to publish the app and then install it from either the Play Store or App Store.

You can read a more detailed explanation of this process in [this section](tutorial/building) of the tutorial.

#### Updates

If you later want to deploy an update to your version of the Lexicon Mobile App, you can use the EAS update command.

First, make sure to configure EAS update by running the following command:

```bash
eas update:configure
```

This command will automatically add the `expo.runtimeVersion` field to your `app.json` file.
You'll see a warning in your terminal telling you to add `expo.updates.url` to `app.json`.

Then run this command to update your project:

```bash
eas update -–branch <channel name>
```

:::note
The channel name is the same as the build profile, so for the preview builds, you can run:

```bash
eas update -–branch preview
```

:::

Read more about updating your app [here](tutorial/updating).

Once published, the new version will be available to your users the next time they open it.

For more details on this process—including publishing to the App Store and Google Play Store—follow the instructions in [Publishing your App](tutorial/publishing).

#### Configure the GraphQL API with your Discourse Server

In order for a published version of the app to be able to contact your Discourse server, you'll need to ensure that:

- The GraphQL API is deployed and running properly on a host that is reachable from the app itself.
- The GraphQL API is configured to point at the correct host and port of your Discourse server
- Your Discourse server is reachable by the GraphQL API
