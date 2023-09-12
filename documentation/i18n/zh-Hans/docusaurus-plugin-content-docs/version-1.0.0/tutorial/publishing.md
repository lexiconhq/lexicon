---
title: Publish your App
---

## EAS Submit

EAS Submit is a service for uploading and submitting your application binaries to App Store and/or Play Store.
Check [here](https://docs.expo.dev/submit/introduction/) to learn more about EAS Submit.

### Prerequisites:

- Registered app in App Store Connect, see the guide [here](../app-store#register-a-new-bundle-id).
- Registered app in Play Store, see the guide [here](../play-store).

### Configuration

Before submitting, you are required to specify the credentials to publish your app.

#### iOS

For iOS, fill in your account information for `appleId`, `ascAppId`, and `appleTeamId`:

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

#### Android

For Android, you will need to add a `.json` key file to authenticate with the Google Play Store. Please follow [this guide](https://github.com/expo/fyi/blob/main/creating-google-service-account.md) to generate one. Then, copy the JSON file to your `lexicon/frontend` directory, and rename the file as `playstore_secret.json`.

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

Now that the configuration is done, you can start submitting your app.

### Submitting

Use this command to submit the build:

```bash
eas submit --platform ios --profile <submit-profile-name>
```

Then you will see the EAS CLI prompt asking which app you would like to submit.

There are 4 possible options:

- Selecting a build from EAS
- Providing the URL of an app archive
- Providing the local path to an app binary file
- Providing the build ID of an existing build on EAS

If you have built your app using EAS Build or have been following the tutorial from [Build your App](building), then please choose the first option, and select the version you want.

### Submit Profiles

By default, `eas.json` has been configured with two submit profiles, which are **staging** and **production**.

The configuration is mostly the same, the only difference lies in the Android track options.

- Staging infers the track as `internal`. This means submitting with the staging profile will submit the build for internal testing in the Play Store.
- Production infers the track as `production`, which will submit the build for Public Release in the Play Store.

With iOS, on the other hand, both profiles will be submitted to TestFlight before you can release them publicly.

You can reference the Expo documentation to learn more about [Android-specific](https://docs.expo.dev/submit/eas-json/#android-specific-options) and [iOS-specific](https://docs.expo.dev/submit/eas-json/#ios-specific-options) options.

## Congratulations!

Your app is now available for users to download from both the Play Store and the App Store! 🥳

To learn more about how to update your published app in the case of a bug, as well as OTA updates, check out the [next and final section](updating) of the tutorial.
