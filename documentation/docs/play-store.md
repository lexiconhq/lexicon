---
title: Publishing to the Play Store
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Prerequisites

:::note
If you don't already have a Google Developer account, note that there is a $25.00 fee to create one.
:::

- A [Google Developer Account](https://play.google.com/console/signup) to access the [Google Play Console](https://play.google.com/console)

## Google Play Console

The [Google Play Console](https://play.google.com/console) enables you to setup your app, invite beta testers, and publish your app to the [Google Play Store](https://play.google.com/store).

Because you're publishing an app that was built using Expo, it is **very important** that you follow [Expo's instructions](https://github.com/expo/fyi/blob/master/first-android-submission.md) for submitting an app to the Google Play store correctly.

### Configuration

Similar to how you configured your `app.json` in [Publishing to the App Store](app-store), you'll need to adjust the `android` section to include the details specific to your app.

```json
   "android": {
      "package": "com.yourdomain.yourapp",
      "versionCode": 1,
      "permissions": []
    },
```

Above, make sure that you always increment the `versionCode` before building a newer version of your app.

Also, there's one additional detail that you might want to add, depending on your app: permissions.

In the example below, we're providing our app with the ability to read and write to external storage.

```json
  "android": {
      "package": "com.yourdomain.yourapp",
      "versionCode": 1,
      "permissions": [ "READ_EXTERNAL_STORAGE" , "WRITE_EXTERNAL_STORAGE"  ]
    },

```

If you don't quite understand how permissions work yet, it's best to check out the [Expo documentation](https://docs.expo.io/versions/latest/sdk/permissions) on this topic in order to get a full understanding.

### Build your App for Android

Because we're working with Expo and React Native, this step isn't too different from building your app for iOS.

From the `frontend/` directory, you'll simply want to run:

```
$ expo build:android
```

When executing this command, you'll be prompted with the option of building your app as an APK or as a bundle.

If you'd like to test the app on your device before publishing it in the Google Play Console, you might want to build it as an APK. This enables you to quickly load it onto your Android device.

However, if you're planning to invite beta testers to your app in the Google Play Console, you'll want to build it as a bundle and submit it through there.

Upon making your selection, Expo will initiate the build process on their servers, and will provide you with a link to monitor its progress.

<img alt="" width="900" src={useBaseUrl('/img/guides/playStore/expo-build.png')}/>

Once Expo has finished building your app, you can download it to retrieve the APK or Bundle.

Then, you can finish the process of publishing it by following Expo's Android-specific guide, [First Submission of an Android App](https://github.com/expo/fyi/blob/master/first-android-submission.md).

For further information about the `expo build:android` command, check Expo's [documentation](https://docs.expo.io/distribution/uploading-apps/#2-start-the-upload).

### Publish to the Play Store

Unlike the process of publishing an iOS app to the App Store, publishing to the Google Play Store is much simpler.

At this point, you can take your app live on the Google Play Store, or you can proceed with internal testing on the Google Play Console. It's really up to you.

And, provided that you've now also published your app to the Apple App Store, congratulations!

Your Lexicon-powered app is now live and ready to be downloaded by your users.
