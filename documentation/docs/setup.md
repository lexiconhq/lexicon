---
title: Development Setup
---

### Clone the Lexicon Repository

If you haven't already, make sure you [clone the Lexicon repository](quick-start#installation) from Github.

### Setup a Discourse Instance, if necessary {#discourse-host}

In order to get started developing against the Lexicon Stack, you'll need a running Discourse instance.

To recap, the Lexicon Stack consists of:

- The Lexicon Mobile App
- A running Discourse instance

Without a Discourse instance, the app has no source to retrieve data from. If the app cannot retrieve any data, the Lexicon Mobile App will not function as intended.

For detailed instructions on setting up a local development instance of Discourse, head over to the [tutorial](./tutorial/setup-discourse), which will walk you through the process.

However, if you already have a deployed instance of Discourse, we'd recommend using that instead.

### Install the Lexicon Discourse Plugin

The Lexicon Discourse Plugin is a Discourse plugin that adds support for [push notifications](./push-notifications/introduction.md) and [email deep linking](./email-deep-linking/intro.md).

You can install the plugin in your Discourse instance by following the instructions in the [Discourse plugin documentation](./discourse-plugin.md).

For local development, you're only able to test out push notifications, as email deep linking requires a published app with a [valid app scheme](https://docs.expo.dev/versions/latest/config/app/#scheme).

If you wish to develop against the plugin itself, you can clone the codebase [here](https://github.com/lexiconhq/discourse-lexicon-plugin.git).

### Configuration

The [Lexicon Stack](concepts#architecture-of-the-lexicon-stack) requires some configuration in order to properly interact with your Discourse server.

this involves configuring the frontend Mobile App, which interacts with the Discourse instance.

The architecture of this setup is depicted in [Architecture of the Lexicon Stack](concepts#architecture-of-the-lexicon-stack).

#### Frontend Mobile App Configuration

:::note
In the initial release of Lexicon, connecting to a Discourse site required setting up Prose and configuring the Prose URL in the mobile app. However, with recent updates, the mobile app now connects directly to Discourse without needing Prose.
:::

To configure the frontend mobile app, you'll first need to set your app name and slug in `frontend/app.json`. The [slug](https://docs.expo.dev/workflow/glossary-of-terms/#slug) is used as part of the URL for your app on Expo's web services, so it is recommended to use kebab-case (e.g., `my-lexicon-app`).

Replace these placeholders with your desired values:

```json
    "name": "<your app name>",
    "slug": "<your app slug>",
```

Next, change the value of `discourseUrl` in `frontend/Config.ts` to the URL of your Discourse instance whether local or already deployed somewhere.

```ts
const config = {
  localDevelopment: {
    discourseUrl: 'http://localhost:4200',
  },
  buildChannels: {
    preview: {
      discourseUrl: 'https://preview.discourseserver.com',
    },
    production: {
      discourseUrl: 'https://discourseserver.com',
    },
  },
};
```

`localDevelopment.discourseUrl` will be used during development when you run the app using `npm run start` or `expo start`, whereas the specific value within `buildChannels` (e.g., `production.discourseUrl`) will be used when actually building the app.

#### Development Scenarios

When developing locally, there are at least three scenarios that you may find yourself in.

Depending on which one applies to you, the config values across `frontend/Config.ts` may need to be set differently.

##### Scenario 1: Existing Discourse Deployment

If you've already deployed the Discourse instance to a host that is publicly reachable. In that case, `frontend/Config.ts` only needs updated to point at the deployed Discourse instance.

For example:

```ts
const config = {
  localDevelopment: {
    discourseUrl: 'https://my-deployed-discourse',
  },
  buildChannels: {
    preview: {
      discourseUrl: 'https://my-deployed-discourse',
    },
    production: {
      discourseUrl: 'https://my-deployed-discourse',
    },
  },
};
```

In the example above, we have configured the app to point at `https://my-deployed-discourse` in all scenarios, including during development when running with `npm run start`.

##### Scenario 2: Run Discourse Locally & Access from a Simulator

:::info
If you are running the Discourse instance locally, you should not expect that the mobile app will continue to function if you turn off your development machine. You must **deploy** the instance before attempting to use the mobile app without depending on your development machine.
:::

This approach involves running the Lexicon Mobile App on your development machine. It is accomplished by instructing Expo to launch the Mobile App in the Android or iOS simulator.

When developing this way, you can simply set `localDevelopment.discourseUrl` to `http://localhost` in `frontend/Config.ts`.

##### Scenario 3: Run Discourse Locally & Access from your Mobile Device

To access your locally running Discourse server from your mobile device, you need to ensure your development machine and mobile device are on the same network.

To manually instruct the Mobile App how to locate your development machine, you'll need to find out what the **local IP address** of your development machine is on your current network.

Note that your local IP address is different from your public IP Address.

If you are not sure how to get your local IP address, you can go to [What Is My Browser: Detect Local IP Address](https://www.whatismybrowser.com/detect/what-is-my-local-ip-address) and follow the instructions.

The website itself may not be able to automatically detect your local IP address, but it will give you instructions on how to locate it within your specific operating system.

You will be given an IP address like `10.0.12.121` or `192.168.17.69`.

You can then update the value in `frontend/Config.ts` to your local IP address.

```javascript
 localDevelopment: {
    discourseUrl: 'http://192.168.17.69:4200',
  }
```

This will allow the app running on your mobile device to properly locate the Discourse server running on your development machine.

###### Reverse Port Forwarding for Android Devices

If you're using an Android device, reverse port forwarding can be used to forward the Discourse server's port (default: `4200`) to the device.

Here are the steps to set up reverse port forwarding:

1. **Connect Your Android Device**  
   Ensure your Android device is connected to the same network as the computer running the Discourse server (e.g., your laptop or desktop).

2. **Check Device ID**  
   Use the following command to verify that your device is connected:

   ```bash
   adb devices -l
   ```

   If your device is successfully connected, it will list your device with its UID and model.

3. **Reverse the Port**  
   Run the following command to set up reverse port forwarding:

   ```bash
   adb -s <UID> reverse tcp:<Discourse Port> tcp:<Discourse Port>
   ```

   Replace `<UID>` with your device ID from the previous step and `<Discourse Port>` with the port your Discourse server is running on (default: `4200`).

   **Example:**

   ```bash
   adb -s C5216a960S05 reverse tcp:4200 tcp:4200
   ```

   This command redirects traffic from your Android device’s `localhost:4200` to your computer’s `localhost:4200`, enabling the app on your device to communicate with the local Discourse server as if it were running on the device itself.

4. **Update the Config File**  
   Open the `Config.ts` file in your project and update the `localDevelopment` configuration as follows:

   ```javascript
   localDevelopment: {
     discourseUrl: 'http://localhost:4200',
     inferDevelopmentHost: false,
   },
   ```

   This ensures the app accesses `localhost` directly on the device instead of `10.0.2.2`, which is used only for Android emulators.

5. **Test the Connection**  
   Once the reverse port forwarding is set up and the configuration is updated, you can use the Lexicon mobile app to connect to your local Discourse server.

## Configure your Discourse Host

As mentioned above, you'll need to have setup a Discourse host for the Lexicon Mobile App to interact with.

We'd like to briefly cover the different approaches to setting up a Discourse Host for development before continuing.

**1. Run a Discourse Instance Locally**

:::note
Ensure that you are managing all of your ports correctly.

The development setup of Discourse with Docker makes use of multiple ports, one of which being **port 4200** by default. You'll want to double-check that none of the environment variables are pointing at the ports Discourse is using.
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

With this approach, you'd simply configure Discourse url in `frontend/Config.ts` to point `discourseUrl` at one of these instances.

```js
 localDevelopment: {
    discourseUrl: 'https://try.discourse.org',
  },
```

## Working with the Codebase

Now that you've prepared everything for development, you can start digging in on the Lexicon codebase.

### Run the Lexicon Mobile App

You can run the Mobile App by executing the following command **from the project root**:

```
$ npm run dev
```

If the app is not installed on your device, navigate to the `frontend` directory and run:

```bash
// For Android:
$ npm run android

// For iOS:
$ npm run ios
```

This will simultaneously launch processes:

- The local Expo dev server, which will enable you to build and launch the React Native app from your device

### Debugging

- Use [React Native Debugging Tools](https://reactnative.dev/docs/debugging) to make the debugging process easier.

Opening the React native Developer Menu depends on your device:

- On an iOS Device: Shake the device, or touch 3 fingers to the screen.
- On the iOS Simulator: Hit `⌘ + ctrl + Z` on a Mac in the emulator.
- On an Android Device: Shake the device vertically, or run `adb shell input keyevent 82` in the terminal window if the device is connected via USB.
- On the Android Emulator: Hit `⌘ + M`, or run `adb shell input keyevent 82` in your terminal window.

- If your changes don't show up, it could involve a cache issue. In this case, you should try restarting Expo.
  - To do so, quit the process by hitting `Ctrl + C` in the Terminal where it is running.
  - Then run `npm run start` again.
  - If the issue persists, you should look for the latest guidance from Expo on how to clear the cache, as it has been known to change.

Other tools that can be used to debug network requests include [Reactotron](https://github.com/infinitered/reactotron), which helps in debugging requests and responses from the Discourse instance.

How to Use Reactotron:

- Install Reactotron on your desktop. For detailed installation instructions, refer to the [official documentation](https://github.com/infinitered/reactotron?tab=readme-ov-file#installation).
- Before running the app, make sure to open Reactotron.
- Run the app, and if the connection is successful, you will see all network requests in Reactotron.

### Running the Test Suites {#run-the-test-suite}

Before running tests, double-check that your changes don't contain any errors.

You can run tests frontend codebases by running the following command from the project root:

```
$ npm run test
```

On top of ensuring that all tests have passed, the command will also notify you if there are any Typescript errors or issues from Prettier or ESLint.

Also note that the process of running `npm run test` triggers an additional action in the frontend to take place before running the tests.

A new folder, `frontend/generatedAPI`, is created and populated with all the GraphQL Query and Mutation types for use in the codebase.

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

Once you're done, verify the `discourseUrl` value you will use for the actual build of the app in `Config.ts`.

:::info
When publishing your app, you must deploy your Discourse server to a publicly accessible location. Refer to the [documentation](setup-discourse.md#setup-discourse-in-the-cloud) for guidance on deploying Discourse if you haven't done so already.
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

- Your Discourse server is reachable by the Lexicon Mobile App
