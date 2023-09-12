---
title: Publishing to the Play Store
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Prerequisites

:::note
If you don't already have a Google Developer account, note that there is a fee to create one.
:::

- A [Google Developer Account](https://play.google.com/console/signup) to access the [Google Play Console](https://play.google.com/console)
- An Expo account
- EAS CLI 2.6.0 or newer

## Google Play Console

The [Google Play Console](https://play.google.com/console) enables you to setup your app, invite beta testers, and publish your app to the [Google Play Store](https://play.google.com/store).

Because you're publishing an app that was built using Expo, it is **very important** that you follow [Expo's instructions](https://github.com/expo/fyi/blob/master/first-android-submission.md) for submitting an app to the Google Play store correctly.

## App Configuration

After setting up your app in the Google Play Console, there are some other adjustments you'll need to make.

### Build Config

Similar to the approach for [Publishing to the App Store](app-store), if you haven’t already, you'll need to set your app name and slug in `frontend/app.json`. The [slug](https://docs.expo.dev/workflow/glossary-of-terms/#slug) is used as part of the URL for your app on Expo's web services, so it is recommended to use kebab-case (e.g., `my-lexicon-app`).

Replace these placeholders with your desired values:

```json
    "name": "<your app name>",
    "slug": "<your app slug>",
```

Then, you need to configure EAS Build by running the following command, or skip to the next [step](play-store#setup-config-values):

```bash
eas build:configure
```

The EAS CLI will prompt you to specify `android.package` and `ios.bundleIdentifier` if those values are not already provided in `app.json`.

Next, verify that the `package` name and other details specific to your app are included in the `android` section of `app.json`. Note that the `versionCode` will be automatically updated when you build the app with the `production` profile, so you don't need to increment the version manually.

Also, there's one further detail that you might want to add, depending on your app's permissions.

In the example below, we're providing our app with the ability to read and write to external storage.

```json
    "android": {
      "package": "<your package name>",
      "permissions": [ "READ_EXTERNAL_STORAGE" , "WRITE_EXTERNAL_STORAGE"  ]
      "versionCode": 1,
    },
```

If your app requires further permissions, be sure to specify them as needed in this part of the configuration.

If you don't quite understand how permissions work yet, it's best to check out the [Expo documentation](https://docs.expo.io/versions/latest/sdk/permissions) on this topic in order to get a full understanding.

### Setup Config Values

:::info
When publishing your app, it is necessary to deploy Prose somewhere publicly accessible, perhaps on a cloud hosting provider like AWS or DigitalOcean. If Prose is only running on your local machine, users that download your app won't be able to use it.
Check [the documentation](deployment) to deploy Prose if you haven't already.
:::

Next, set the **Prose URL** for your builds in `Config.ts`. You can set a different URL for each build channel.

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

### Add the Play Store Secret File

For the last step, you'll need to provide a `.json` file containing a private key in order to interact with the Play Store. Follow [this guide](https://github.com/expo/fyi/blob/main/creating-google-service-account.md) to generate one. Then, copy the JSON file to your `lexicon/frontend` directory, and rename the file as `playstore_secret.json`.

The JSON file looks like this:

```json
{
  "type": "service_account",
  "project_id": "<your project ID>",
  "private_key_id": "<your private key ID>",
  "private_key": "-----BEGIN PRIVATE KEY-----<your private key>-----END PRIVATE KEY-----\n",
  "client_email": "<your client email>",
  "client_id": "<your client ID>",
  "auth_uri": "<your auth URI>",
  "token_uri": "<your token URI>",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/lexicon%40api.iam.gserviceaccount.com"
}
```

## Build your App for Android

Because we're working with Expo and React Native, this step isn't too different from building your app for iOS.

From the `frontend/` directory, you can run this command to check the app before publishing:

```bash
eas build --platform android --profile preview
```

Running `eas build` with the `preview` profile will build the app as an APK. This allows you to quickly load it onto your Android device or emulator. After the build is done, navigate to your project in the [Expo web console](https://expo.dev), then click on the **Builds** menu located on the left-hand side of the screen.

- Click on the project you want to install.

  <img alt="Builds" width="900" src={useBaseUrl('/img/guides/playStore/builds.png')}/>

- Download the app by pressing the `Install` button in the `Build Artifact` section.

  <img alt="Build Artifact" width="900" src={useBaseUrl('/img/guides/playStore/build-artifact.png')}/>

You can download and launch the app on your real device, or drag the downloaded APK file to your emulator.

Once you have verified that the app runs as expected, you can proceed to build it for release:

```bash
eas build --platform android --profile production
```

The approach for a production build is similar to the one used for generating a preview build. However, unlike a preview build, you won't be able to launch the production build in Android emulator—it is intended solely for publishing to the Play Store.

Once this process is completed, you can proceed with submitting it to the Play Store.

## Publish to the Play Store

At this point, you can take your app live on the Google Play Store, or you can proceed with internal testing on the Google Play Console.

To proceed with internal testing, run this command:

```bash
eas submit --platform android --profile staging
```

To release your app publicly, run this command:

```bash
eas submit --platform android --profile production
```

You can read more about build profiles [here](tutorial/publishing).

At this point, provided that you've completed all the steps, congratulations! Your Lexicon-powered mobile app is now live and ready to be downloaded by your users.
