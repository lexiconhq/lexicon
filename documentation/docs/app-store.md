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

To get started with Test Flight and publishing your app, you'll need an **Apple Developer account** account.

This will enable you to interact with Apple as you go through the process of submitting to Test Flight and, eventually, the App Store.

Similarly, you'll need an [Expo account](https://expo.dev/signup) so you can build your app, download it, and upload it to Apple's servers.

Finally, you'll want to have already downloaded and installed [Xcode](https://developer.apple.com/xcode/), which is what you'll use to upload your built app to Apple's servers.

:::note
If you don't yet have an account, you'll need to enroll in the [Apple Developer Program](https://developer.apple.com/programs/enroll/) first. Note that there is an annual cost associated with this.
:::

Additionally, you'll want to make sure that you have accounts

## Publish to Test Flight

Test Flight is a key aspect of Apple's Developer Program, which enables developers to provide beta users with access to their app under less-strict review requirements.

With Test Flight, you're able to invite users to test and collect their feedback before releasing your app to the public on the App Store.

You can learn more about Test Flight [here](https://developer.apple.com/testflight/).

### Register a new Bundle ID

Each App in the App Store has a unique **Bundle Identifier**, or Bundle ID.

In order to publish the app anywhere, including to Test Flight, you'll need to have a Bundle ID registered for your app with Apple.

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

### Add New App in App Store Connect

Steps:

- Sign in to your [App Store Connect](https://appstoreconnect.apple.com/) account.
- Click on `My Apps`.
  <img alt="App Connect" width="900" src={useBaseUrl('/img/guides/testFlight/app-connect.png')}/>
- Click on the `+` button to add new app.
  <img alt="Add New App" width="900" src={useBaseUrl('/img/guides/testFlight/add-app.png')}/>
- Fill out the requested information about your app, and then click `Create`.
  <img alt="Add New App" width="900" src={useBaseUrl('/img/guides/testFlight/new-app.png')}/>

  - **Platforms**: Select `iOS`.
  - **Name** : The name of your app, as it will appear on the App Store and user's devices.
  - **Primary Language** : The Primary language that will be used if localized app information is not available.
  - **Bundle ID** : Choose the Bundle ID you created above.
    - **Note**: double-check that it's correct, because you can not change it afterwards.
  - **SKU (Stock Keeping Unit)**: A unique ID to differentiate your app from the others, similar to a product ID.
  - **User Access** Full access means all users will have access to the app, while limited access means that the app can only be accessed by certain roles defined within App Store Connect.

### Configuration

After creating the app in App Store Connect, you'll want to jump back over to the codebase and make some adjustments.

In particular, you'll want to open `frontend/app.json` and find the `ios` section of the file.

```
   "ios": {
      "supportsTablet": false
    },
```

Then, you'll want to add the information you just registered in App Store Connect:

```
   "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.companyname.appname",
      "buildNumber": "1.0.0",
      "config": {
        "usesNonExemptEncryption" : false
      }
    },
```

:::note
We set `usesNonExemptEncryption` to `false` because Lexicon doesn't leverage that feature.

For further details, please take a look at [this link](https://developer.apple.com/documentation/bundleresources/information_property_list/itsappusesnonexemptencryption) from Apple's documentation.
:::

### Build your App for iOS

Before publishing, you'll need to build your app by instructing Expo to generate an iOS build, like so:

```
$ expo build:ios
```

When you run the above command, Expo will prompt you for your Apple ID and password.

Expo provides documentation about this step on [Building Standalone Apps](https://docs.expo.io/distribution/building-standalone-apps/#if-you-choose-to-build-for-ios).

Once the above step has completed, login to your account on [Expo](https://expo.io) and download your newly built app.

It is located under **Recent Builds**. You can also simply click on the Builds menu that's located on the left-hand side of the screen.

- Click on the project you want to publish. Double-check that the build status is **Finished** and the platform is **iOS**.
  <img alt="Builds" width="900" src={useBaseUrl('/img/guides/testFlight/builds.png')}/>

- Download the iOS build by pressing `Download` button on Build artifact section.
  <img alt="Build Artifact" width="900" src={useBaseUrl('/img/guides/testFlight/build-artifact.png')}/>

This will download an IPA file representing your app, which is the format that Apple expects it to be in.

### Upload your App to Apple

:::note
You'll need to download the Application Loader developer tool if you haven't done so before.
:::

Now that you've downloaded the IPA file you'll need to upload it to Apple's servers.

In order to do this, you'll need to open the Application Loader in XCode.

This is located under the XCode menu in the menubar when XCode is open.

```
XCode > Open Developer Tool > Application Loader
```

If Application Loader isn't there, you'll need to download it. Click on "More Developer Tools..." and download it from the Apple Developer Website.

Once it's ready, you can proceed with the steps below.

Upon opening Application Loader, you'll likely be prompted for the credentials of your Apple Developer account.

Once you've successfully submitted them, you'll be able to select the IPA file from your file system.

After selecting it, click "Open" in order to begin uploading the IPA.

### Submit to Test Flight

Once the IPA has been uploaded, you can submit it to Test Flight.

In App Store Connect, click on the Test Flight Tab.

You'll see the [status](https://help.apple.com/app-store-connect/#/dev3d6869aff) of your built version.

- **Red** indicates that you need to perform some action.
- **Yellow** indicates that some aspect of the process is pending—either from you, or from Apple.
- **Green** indicates that the build is being tested in Test Flight, or is ready to be submitted for review.

You won't be able to begin beta testing with Test Flight until an tester from Apple verifies your app.

In order to allow Apple to properly test your Lexicon-powered app, they'll need to have credentials to login your Discourse site.

Before submitting your app, you'll need to create those credentials in Discourse and specify them in App Store Connect.

- In App Store Connect, click on your app.
- Click on Test Flight App.
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

Test Flight and App Store Connect are sophisticated tools to help with the process of submitting, testing, and publishing your app.

If you have further questions or just want to learn more, we'd recommend that you make use of Apple's documentation, which is very high quality.

For more information about Test Flight in general, read the [documentation](https://developer.apple.com/testflight/).

Similarly, for specific information about beta testing with Test Flight, check out [Testing Apps with TestFlight](https://testflight.apple.com/).

## Publish to the App Store

Once you've successfully passed Apple's review process and have received enough feedback from your beta testers, you're ready to publish to the App Store and go live! :tada:

As a few final reminders, double-check that...

- Your Discourse instance is online, reachable, and functioning correctly.
- The built version of your app is configured to point at the correct Prose server.
- Your Prose server is online, reachable and healthy.
- Your Prose server is deployed with the [recommended guidlines](dedicated#configure--deploy-prose) for production.
  - In particular, ensure that its traffic is encrypted using an SSL certificate.

Next, we'll guide you through the process of publishing your app for Android devices on the Google Play Store.
