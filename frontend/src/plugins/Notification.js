/**
 * This file is required to handle the bug with Android notification icons when using expo-notifications, which shows a blank icon after updating to FCM v1. This is a work around solution until Expo fixes the problem.
 * For more details about this issue, refer to https://github.com/expo/expo/issues/24844.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

const withFirebaseMessagingNotificationIcon = (config) => {
  return withAndroidManifest(config, async (config) => {
    config.modResults = await setFirebaseMessagingConfig(
      config,
      config.modResults,
    );
    return config;
  });
};

async function setFirebaseMessagingConfig(config, androidManifest) {
  // Ensure that the manifest has an application node
  const mainApplication =
    AndroidConfig.Manifest.getMainApplication(androidManifest);

  // Add the custom meta-data
  AndroidConfig.Manifest.addMetaDataItemToMainApplication(
    mainApplication,
    // value for android:name
    'com.google.firebase.messaging.default_notification_icon',
    // value for android:resource
    '@drawable/notification_icon',
    'resource',
  );

  return androidManifest;
}

module.exports = withFirebaseMessagingNotificationIcon;
