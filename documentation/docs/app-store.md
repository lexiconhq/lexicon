---
title: Publishing to the App Store
---

import useBaseUrl from '@docusaurus/useBaseUrl';

At this point, you've at least made some minor adjustments to the Lexicon Mobile App, and are ready to publish it so that your users can download it.

In this page, we'll cover the process of publishing it on iOS.

## Prerequisites

- An Apple Developer account
- An Expo account
- XCode is installed on your development machine
- EAS CLI 2.6.0 or newer

To get started with TestFlight and publishing your app, you'll need an **Apple Developer account**.

This will enable you to interact with Apple as you go through the process of submitting to TestFlight and, eventually, the App Store.

You'll also need an [Expo account](https://expo.dev/signup) so you can build your app, download it, and upload it to Apple's servers.

Finally, you'll want to have already downloaded and installed [Xcode](https://developer.apple.com/xcode/), which is what you'll use to upload your built app to Apple's servers.

:::note
If you don't yet have an account with Apple, you'll need to enroll in the [Apple Developer Program](https://developer.apple.com/programs/enroll/) first. Note that there is an annual cost associated with this.

Additionally, you'll want to make sure you have an account with [Expo](https://expo.dev/signup) so you can use features like [EAS Submit](https://docs.expo.dev/submit/introduction/).
:::

## Register a new Bundle ID

Each app in Apple's App Store has a unique **Bundle Identifier**, or Bundle ID.

In order to publish the app anywhere, including to TestFlight, you'll need to have a Bundle ID registered for your app with Apple.

Typically, this uses the format of `com.<yourcompany>.<yourappname>`.

For example, if your company is named Expo, and your app is named Expo Go, your Bundle ID could be:

```
com.expo.expogo
```

You can follow these instructions to get one.

- Go to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/bundleId/add/bundle).
- Fill in the following fields, and then click `Continue`
  <img alt="Regsiter App" width="900" src={useBaseUrl('/img/guides/testFlight/register-app-id.png')}/>

  - **Description**: You can insert the app name as its description.

  - **Bundle ID**: Select `Explicit`, and then insert then insert your bundle ID in the input field.

- Capabilities

  - You can leave this section empty.

## Add a New App in App Store Connect

Steps:

- Sign in to your [App Store Connect](https://appstoreconnect.apple.com/) account.
- Click on `My Apps`.
  <img alt="App Connect" width="900" src={useBaseUrl('/img/guides/testFlight/app-connect.png')}/>
- Click on the `+` button to add new app.
  <img alt="Add New App" width="900" src={useBaseUrl('/img/guides/testFlight/add-app.png')}/>
- Fill out the requested information about your app, and then click `Create`.
  <img alt="Add New App" width="900" src={useBaseUrl('/img/guides/testFlight/new-app.png')}/>

  - **Platforms**: Select `iOS`.
  - **Name**: The name of your app, as it will appear on the App Store and user's devices.
  - **Primary Language**: The primary language that will be used if localized app information is not available.
  - **Bundle ID**: Choose the Bundle ID you created above.
    - **Note**: double-check that it's correct, because you can not change it afterwards.
  - **SKU (Stock Keeping Unit)**: A unique ID to differentiate your app from the others, similar to a product ID.
  - **User Access**: Full access means all users will have access to the app, while limited access means that the app can only be accessed by certain roles defined within App Store Connect.

## Configuration

After creating the app in App Store Connect, you'll want to jump back over to the codebase and make some adjustments.

### Build Config

:::note
If you haven't yet installed the EAS CLI, follow the instructions in the [tutorial](tutorial/setup#install-the-eas-cli).
:::

First, you'll need to ensure you've set your app name and slug in `frontend/app.json`. The [slug](https://docs.expo.dev/workflow/glossary-of-terms/#slug) is used as part of the URL for your app on Expo's web services, so it is recommended to use kebab-case (e.g., `my-lexicon-app`).

Replace these placeholders with your desired values:

```json
    "name": "<your app name>",
    "slug": "<your app slug>",
```

Next, configure EAS Build by running this command from the `frontend/` directory:

```bash
eas build:configure
```

The EAS CLI will prompt you to specify `android.package` and `ios.bundleIdentifier` if those values are not already provided in `app.json`. You'll want to add the bundle ID you just registered in App Store Connect as the `bundleIdentifier`.

Then you can see that the value has been updated in the `ios` section of `frontend/app.json` file.

```json
   "ios": {
      "supportsTablet": false,
      "buildNumber": "1.0.0",
      "bundleIdentifier": "<your bundle ID>",
      "config": {
        "usesNonExemptEncryption" : false
      }
    },
```

:::note
We set `usesNonExemptEncryption` to `false` because Lexicon doesn't leverage that feature.

For further details, please take a look at [this link](https://developer.apple.com/documentation/bundleresources/information_property_list/itsappusesnonexemptencryption) from Apple's documentation.
:::

### Setup Config Values

:::info
When publishing your app, it is necessary to deploy Prose somewhere publicly accessible, perhaps on a cloud hosting provider like AWS or DigitalOcean. If Prose is only running on your local machine, users that download your app won't be able to use it.
Check [the documentation](deployment) to deploy Prose if you haven't already.
:::

Next, configure the **Prose URL** for your build in `Config.ts`. You can set a different URL for each build channel.

:::note
In the original release of Lexicon, the **Prose URL** was specified in `frontend/.env`. However, as part of migrating to Expo's EAS feature, we centralized the configuration into `frontend/Config.ts` to save you the trouble of needing to maintain it in more than one place, as suggested in the [Expo documentation](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)
:::

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

### Setup Apple Dveloper Account

Lastly, please adjust these fields in `eas.json` with your account information to submit the app:

```json
   "base": {
      "ios": {
        "appleId": "<your apple ID>",
        "ascAppId": "<your App Store connect ID>",
        "appleTeamId": "<your apple team ID>"
      },
      ...
   },
```

- **appleId**: your apple ID (e.g., `john@gmail.com`).
- **ascAppId**: your App Store Connect app ID. Find your ascAppID by following [this guide](https://github.com/expo/fyi/blob/main/asc-app-id.md) (e.g., `1234567890`).
- **appleTeamId**: You can check your apple team ID [here](https://developer.apple.com/account/) (e.g., `12LE34XI45`).

## Build your App for iOS

Before publishing, you'll need to build your app by instructing Expo to generate an iOS build.

It is recommended to build your app with the `preview` profile before releasing to verify that it works as expected. See [this tutorial](tutorial/building) to learn more about build profiles.

Run this command:

```bash
eas build --platform ios --profile preview
```

When you run the above command, Expo will prompt you for your Apple ID and password.

Once the above step has been completed, login to your account on [Expo](https://expo.dev) and download your newly built app.

Navigate to your project in the [Expo web console](https://expo.dev), then click on the **Builds** menu located on the left-hand side of the screen.

- Click on the project you want to install.
  <img alt="Builds" width="900" src={useBaseUrl('/img/guides/testFlight/builds.png')}/>

- Download the iOS build by pressing the `Download` button in the `Build Artifact` section.
  <img alt="Build Artifact" width="900" src={useBaseUrl('/img/guides/testFlight/build-artifact.png')}/>

This will download a tar file containing your app. Extract the file, then drag it to your simulator to install it. See [this section](tutorial/building#1-preview) of the tutorial to learn about running the app on real devices.

Once you have verified that the app runs as expected, you can proceed to build it for release:

```bash
eas build --platform ios --profile production
```

The approach for a production build is similar to the one used for generating a preview build. However, unlike a preview build, you won't be able to launch the production build in the iOS simulator—it is intended solely for publishing to the App Store.

Once this process is completed, you can proceed with submitting it to Apple. This process typically involves Apple's TestFlight service.

## Submit to TestFlight

TestFlight is a key aspect of Apple's Developer Program, which enables developers to provide beta users with access to their app under less restrictive review requirements.

With TestFlight, you're able to invite users to test your app and collect their feedback before releasing it to the public on the App Store. You can learn more about TestFlight [here](https://developer.apple.com/testflight/).

Submitting an iOS app is much easier with EAS Submit. This is covered in more detail in the [tutorial](tutorial/publishing).

Run the following command to start publishing the app to TestFlight:

```bash
eas submit --platform ios --profile production
```

Once the process has completed successfully, we can check the build in App Store Connect.

In App Store Connect, click on the TestFlight Tab.

You'll see the [status](https://help.apple.com/app-store-connect/#/dev3d6869aff) of your built version.

- **Red** indicates that you need to perform some action.
- **Yellow** indicates that some aspect of the process is pending—either from you, or from Apple.
- **Green** indicates that the build is being tested in TestFlight, or is ready to be submitted for review.

You won't be able to begin beta testing with TestFlight until an official tester from Apple verifies your app.

In order to allow Apple to properly test your Lexicon-powered app, they'll need to have credentials to login your Discourse site.

Before submitting your app, you'll need to create those credentials in Discourse and specify them in App Store Connect.

- In App Store Connect, click on your app.
- Click on TestFlight App.
- Click on Test Information in the sidebar on the left-hand side.
- Fill the required fields, then check the `Sign in required` checkbox, and enter the credentials.
  <img alt="Review Information Sign In" width="900" src={useBaseUrl('/img/guides/testFlight/review-signin.png')}/>
- Please also provide information for a person to contact if the review team needs additional information.
  <img alt="Review Information Contact" width="900" src={useBaseUrl('/img/guides/testFlight/review-contact.png')}/>

### Specify Users for Beta Testing

Beta Test Users can belong to an Internal Group or an External Group.

You can specify internal users by going to the Internal Group section, and clicking on **App Store Connect Users**.

Similarly, you can specify external users by selecting External Groups, and clicking on **Add External Testers**.

#### More Information

TestFlight and App Store Connect are sophisticated tools to help with the process of submitting, testing, and publishing your app.

If you have further questions or just want to learn more, we'd recommend that you make use of Apple's documentation, which is very high quality.

For more information about TestFlight in general, read the [documentation](https://developer.apple.com/testflight/).

Similarly, for specific information about beta testing with TestFlight, check out [Testing Apps with TestFlight](https://testflight.apple.com/).

## Publish to the App Store

Once you've successfully passed Apple's review process and have received enough feedback from your beta testers, you're ready to publish to the App Store and go live! :tada:

As a few final reminders, double-check that...

- Your Discourse instance is online, reachable, and functioning correctly.
- The built version of your app is configured to point at the correct Prose server.
- Your Prose server is online, reachable and healthy.
- Your Prose server is deployed with the [recommended guidlines](dedicated#configure--deploy-prose) for production.
  - In particular, ensure that its traffic is encrypted using an SSL certificate.

Next, we'll guide you through the process of publishing your app for Android devices on the Google Play Store.
