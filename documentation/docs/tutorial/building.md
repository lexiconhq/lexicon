---
title: Build your App
---

## EAS Build

EAS Build is the upgraded version of `expo build`. This service helps to build app binaries for your Expo and React Native projects. Read more about it in the Expo documentation [here](https://docs.expo.dev/build/introduction/).

### Configuration

Let's get started by configuring EAS build. Check [here](https://docs.expo.dev/build-reference/build-configuration/) to see the complete guide from Expo.

#### Build Setup

Run this command in `/frontend` directory:

```bash
eas build:configure
```

When running that command, the EAS CLI will typically do the following:

1. It will prompt you for the EAS project ID, either to use an existing ID if you have one, or create a new one. Then it will automatically add the `expo.extra.eas.projectId` field in `app.json`.
2. It will create a new `eas.json` file if one doesn’t already exist. However, we have that set up for you, so you don't need to worry about creating one. 🎉
3. It will prompt you to specify `android.package` and `ios.bundleIdentifier` if those values are not already provided in `app.json`. Note that those two values don't have to be the identical.

You can see that the values in `app.json` are updated after running the command.

#### Configuration Values

:::info
When publishing your app, it is necessary to deploy Prose somewhere publicly accessible, perhaps on a cloud hosting provider like AWS or DigitalOcean. If Prose is only running on your local machine, users that download your app won't be able to use it.
Check [the documentation](deployment) to deploy Prose if you haven't already.

In the original release of Lexicon, the **Prose URL** was specified in `frontend/.env`. However, as part of migrating to Expo's EAS feature, we centralized the configuration into `frontend/Config.ts` to save you the trouble of needing to maintain it in more than one place, as suggested in the [Expo documentation](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)
:::

Next, open `Config.ts` and overwrite the placeholder values with the Prose URL you want to use for the build version. You can either set the same values or a different one for each channel. You don't need to adjust the values in `localDevelopment` since that is only used in development, and not when building the app.

```ts
const config = {
  // ...
  buildChannels: {
    preview: {
      proseUrl: 'http://PLACEHOLDER.change.this.to.your.prose.url',
    },
    production: {
      proseUrl: 'http://PLACEHOLDER.change.this.to.your.prose.url',
    },
  },
};
```

### Run a Build

#### Build for Both Platforms

To build on both platforms, you can use either of the commands below:

```bash
eas build --platform all
```

```bash
eas build -p all
```

#### iOS only

```bash
eas build --platform ios
```

#### Android only

```bash
eas build --platform android
```

#### Run a build with a specific profile

```bash
eas build --platform all –-profile <build-profile-name>
```

```bash
eas build -p all –e <build-profile-name>
```

:::note
Without --profile, the EAS CLI will default to the `production` profile.
:::

### Build Profiles

Build profiles serve as a way of grouping configuration values for different scenarios when building the mobile app.

You can find more details [here](https://docs.expo.dev/build/eas-json/).

The `eas.json` file can contain multiple build profiles. However, it typically has 3 profiles: **preview**, **development**, and **production**.

#### 1. Preview

Purpose: to internally test the app in production-like circumstances.

It is recommended to try building with the preview profile **_first_** before building your app with the production profile. That way, you can ensure the app runs as expected before it’s ready to be published.

The build type for Android will be an **APK** file, whereas the iOS build will output a format that can be installed on the simulator.

This is because the `ios.simulator` option was specified in `eas.json`:

```json
    "ios": {
        "simulator": true
    },
```

If you want to run the preview build on a real device, you'll need have an Apple account with Apple Developer Enterprise Program membership, then add the `ios.enterpriseProvisioning` value in `eas.json`:

```json
    "ios": {
        "enterpriseProvisioning": "universal"
    }
```

For the `preview` build profile, we have already set the distribution mode to [internal](https://docs.expo.dev/build/internal-distribution/). This ensures that EAS build provides shareable URLs for builds, with instructions on how to get them running.

This approach then allows us to test the app without submitting to the App Store or Play Store.

#### 2. Development

Purpose: to make debugging easier. Expo will automatically include developer tools in the build. As you may have figured, this build should never be published to either of the app stores.

Development builds depend on [expo-dev-client](https://docs.expo.dev/development/introduction/), so Expo will prompt us to install the library if needed.

Similar to preview builds, you can add the iOS options mentioned above to run them on a simulator or real device.

#### 3. Production

Purpose: for submission to the App Store and Play Store—as a public release, or as part of testing in each respective ecosystem.

In order to use builds like this, they must be installed through the respective app stores.

After running builds with this profile, you'll see that the iOS and Android versions have automatically been incremented. As you might expect, this is because `autoIncrement` has been set to `true`.

It is worth noting, however, that this behavior only applies to TestFlight and Internal Testing, so you'll need to be sure to also manually increment the `expo.version` in `app.json` for public release. Expo provides further [documentation](https://docs.expo.dev/build-reference/app-versions/) on this topic.

## The App is Built

Great work! You can now share the installation link with your peers so they can try out the app.

In the next section, you'll learn how to [publish](publishing) your app to the App Store and Play Store! 🚀
