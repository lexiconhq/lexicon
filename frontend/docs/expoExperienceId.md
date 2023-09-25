# Expo Experience Id Push notifications

## Overview

In our integration with the Discourse Lexicon plugin, the Expo experience ID is required to support push notifications. We obtain this from Expo in the mobile app by making use of the [`expo-constants`](https://docs.expo.dev/versions/latest/sdk/constants/) package. According to the documentation, we can access the `expoConfig.originalFullName` or `expoConfig.currentFullName` properties to obtain the desired value.

## Why Experience Id Require

The requirement for the experience ID in the Discourse Lexicon Plugin arises from the need to handle the error known as `PUSH_TOO_MANY_EXPERIENCE_IDS`. This error occurs when attempting to send push notifications, and it can be further understood and managed by referring to the [documentation here](https://docs.expo.dev/push-notifications/sending-notifications/#request-errors).

## Result From Researching Experience Id

The experience ID used for push notifications follows the format `@username/project`. According to the Expo documentation and research conducted within the Lexicon project, we can obtain the experience ID by utilizing `expoConfig.originalFullName` or `expoConfig.currentFullName`. To achieve this, it's necessary to include these values within the `app.json` file of the Lexicon project. Here the example of value

```json
{
  "name": "<insert your app name>",
  "slug": "<insert your app name>",
  "scheme": "<your-scheme-here>",
  "currentFullName": "@<username>/<slugName>",
  "originalFullName": "@<username>/<slugName>"
}
```

If we haven't configured these values in the `app.json` file, running the app locally in development mode, building it, or performing an EAS update will result in `undefined` values being returned from the `expo-constants` package.

Here is the distinction between `currentFullName` and `originalFullName` based on the Expo documentation:

- `originalFullName`: This constant represents the initial name of your Expo project as defined when the project was created. Even if the project is transferred between accounts or renamed, this value will remain unchanged.

- `currentFullName`: In contrast, this constant reflects the current name of your app. It might change if you decide to rename your app in the future. When a project is transferred between accounts or renamed, this value may be updated to match the latest name.

In summary, while "originalFullName" retains the app's original name, "currentFullName" keeps track of the app's current name, which can change due to renaming or transfers.

Another constant that can be utilized is `manifest2.extra.scopeKey`, which provides the experience ID value. This value can be obtained from `manifest2` when running the APK in local development mode and after performing an EAS update to build the APK. However, it will return null if the APK is built without utilizing an EAS update.

The value from `manifest2.extra.scopeKey` will be auto-generated based on the `projectId` in `app.json`. If no `projectId` value is set, it will return the value `anonymous` for the user, such as `@anonymous/<insert your app name>-2339463f-0c9d-4d59-9898-55d6adf8f37b`. Where UUID will be add in scopeKey if there are no project id to make unique identifier.

#### Table Constants Experience Id in Lexicon

| Name                             | Value               | Development | Build | Update |
| -------------------------------- | ------------------- | ----------- | ----- | ------ |
| manifest.extra.scopeKey          | @kfox/kf-lounge     | ✅          | ❌    | ✅     |
| currentFullName/OriginalFullName | <based on app.json> | ✅          | ✅    | ✅     |

Here Result of expoConfig and manifest2 value in app

### Local Development

```json
{
  "expoConfig": {
    "name": "KF Lounge",
    "slug": "kf-lounge",
    "scheme": "kf-lounge",
    "version": "1.1.7",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff",
      "imageUrl": "http://192.168.1.4:8081/assets/./assets/images/splash.png"
    },
    "userInterfaceStyle": "automatic",
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "packagerOpts": {
      "config": "metro.config.js",
      "sourceExts": [
        "expo.ts",
        "expo.tsx",
        "expo.js",
        "expo.jsx",
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "wasm",
        "svg"
      ]
    },
    "ios": {
      "supportsTablet": false,
      "buildNumber": "1.0.0",
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "com.kodefox.kflounge",
      "permissions": ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
      "googleServicesFile": "",
      "versionCode": 29
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["expo-localization"],
    "_internal": {
      "isDebug": false,
      "projectRoot": "/Users/switzer/Desktop/lexicon/frontend",
      "dynamicConfigPath": {},
      "staticConfigPath": "/Users/switzer/Desktop/lexicon/frontend/app.json",
      "packageJsonPath": "/Users/switzer/Desktop/lexicon/frontend/package.json"
    },
    "sdkVersion": "49.0.0",
    "platforms": ["ios", "android"],
    "iconUrl": "http://192.168.1.4:8081/assets/./assets/icon.png",
    "hostUri": "192.168.1.4:8081"
  },
  "manifest2": {
    "id": "fe70a46f-547c-4389-ad96-8dfb9e910dd0",
    "createdAt": "2023-08-09T07:55:27.551Z",
    "runtimeVersion": "exposdk:49.0.0",
    "launchAsset": {
      "key": "bundle",
      "contentType": "application/javascript",
      "url": "http://192.168.1.4:8081/index.bundle?platform=android&dev=true&hot=false&lazy=true"
    },
    "assets": [],
    "metadata": {},
    "extra": {
      "expoClient": {
        "name": "KF Lounge",
        "slug": "kf-lounge",
        "scheme": "kf-lounge",
        "version": "1.1.7",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "splash": {
          "image": "./assets/images/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "imageUrl": "http://192.168.1.4:8081/assets/./assets/images/splash.png"
        },
        "userInterfaceStyle": "automatic",
        "updates": {
          "fallbackToCacheTimeout": 0,
          "url": "https://u.expo.dev/74846d43-b313-4543-9590-71704cc3a568"
        },
        "assetBundlePatterns": ["**/*"],
        "packagerOpts": {
          "config": "metro.config.js",
          "sourceExts": [
            "expo.ts",
            "expo.tsx",
            "expo.js",
            "expo.jsx",
            "ts",
            "tsx",
            "js",
            "jsx",
            "json",
            "wasm",
            "svg"
          ]
        },
        "ios": {
          "supportsTablet": false,
          "buildNumber": "1.0.0",
          "config": {
            "usesNonExemptEncryption": false
          }
        },
        "android": {
          "package": "com.kodefox.kflounge",
          "permissions": ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
          "googleServicesFile": "{\n  \"project_info\": {\n    \"project_number\": \"301575653646\",\n    \"project_id\": \"kflounge-aa9d1\",\n    \"storage_bucket\": \"kflounge-aa9d1.appspot.com\"\n  },\n  \"client\": [\n    {\n      \"client_info\": {\n        \"mobilesdk_app_id\": \"1:301575653646:android:2860ef5ec5c5ceceb02f5f\",\n        \"android_client_info\": {\n          \"package_name\": \"com.kodefox.kflounge\"\n        }\n      },\n      \"oauth_client\": [\n        {\n          \"client_id\": \"301575653646-gg3u22vdrmir0aa38uirlvbv433m4c8c.apps.googleusercontent.com\",\n          \"client_type\": 3\n        }\n      ],\n      \"api_key\": [\n        {\n          \"current_key\": \"AIzaSyDV8j1qkZdCdKlvSRvyOI2566cVXGfAnLs\"\n        }\n      ],\n      \"services\": {\n        \"appinvite_service\": {\n          \"other_platform_oauth_client\": [\n            {\n              \"client_id\": \"301575653646-gg3u22vdrmir0aa38uirlvbv433m4c8c.apps.googleusercontent.com\",\n              \"client_type\": 3\n            }\n          ]\n        }\n      }\n    }\n  ],\n  \"configuration_version\": \"1\"\n}\n",
          "versionCode": 29
        },
        "web": {
          "favicon": "./assets/favicon.png"
        },
        "plugins": ["expo-localization"],
        "_internal": {
          "isDebug": false,
          "projectRoot": "/Users/switzer/Desktop/lexicon/frontend",
          "dynamicConfigPath": {},
          "staticConfigPath": "/Users/switzer/Desktop/lexicon/frontend/app.json",
          "packageJsonPath": "/Users/switzer/Desktop/lexicon/frontend/package.json"
        },
        "sdkVersion": "49.0.0",
        "platforms": ["ios", "android"],
        "iconUrl": "http://192.168.1.4:8081/assets/./assets/icon.png",
        "hostUri": "192.168.1.4:8081"
      },
      "expoGo": {
        "debuggerHost": "192.168.1.4:8081",
        "logUrl": "http://192.168.1.4:8081/logs",
        "developer": {
          "tool": "expo-cli",
          "projectRoot": "/Users/switzer/Desktop/lexicon/frontend"
        },
        "packagerOpts": {
          "dev": true
        },
        "mainModuleName": "index",
        "__flipperHack": "React Native packager is running"
      },
      "scopeKey": "@kfox/kf-lounge"
    },
    "isVerified": true,
    "name": "My New Experience",
    "primaryColor": "#023C69",
    "iconUrl": "https://d3lwq5rlu14cro.cloudfront.net/ExponentEmptyManifest_192.png",
    "orientation": "default"
  }
}
```

### Build APK

```json
{
  "expoConfig": {
    "name": "KF Lounge",
    "slug": "kf-lounge",
    "scheme": "kf-lounge",
    "version": "1.1.7",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "userInterfaceStyle": "automatic",
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/74846d43-b313-4543-9590-71704cc3a568"
    },
    "assetBundlePatterns": ["**/*"],
    "packagerOpts": {
      "config": "metro.config.js",
      "sourceExts": [
        "expo.ts",
        "expo.tsx",
        "expo.js",
        "expo.jsx",
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "wasm",
        "svg"
      ]
    },
    "ios": {
      "supportsTablet": false,
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.kodefox.kflounge",
      "permissions": ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
      "googleServicesFile": "./google-services.json",
      "versionCode": 29
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["expo-localization"],
    "sdkVersion": "49.0.0",
    "platforms": ["ios", "android"]
  },
  "manifest2": null
}
```

### After Eas Update

> **Note:** for manifest2 value is already inside extra or `manifest2.extra`

```json
{
  "expoConfig": {
    "ios": {
      "buildNumber": "31",
      "supportsTablet": false,
      "bundleIdentifier": "com.kodefox.kflounge"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "icon": "./assets/icon.png",
    "name": "KF Lounge",
    "slug": "kf-lounge",
    "scheme": "kf-lounge",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.kodefox.kflounge",
      "permissions": ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
      "versionCode": 31,
      "googleServicesFile": "./google-services.json"
    },
    "updates": {
      "url": "https://u.expo.dev/74846d43-b313-4543-9590-71704cc3a568",
      "fallbackToCacheTimeout": 0
    },
    "version": "1.1.9",
    "platforms": ["ios", "android"],
    "sdkVersion": "49.0.0",
    "orientation": "portrait",
    "packagerOpts": {
      "config": "metro.config.js",
      "sourceExts": [
        "expo.ts",
        "expo.tsx",
        "expo.js",
        "expo.jsx",
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "wasm",
        "svg"
      ]
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    },
    "userInterfaceStyle": "automatic",
    "assetBundlePatterns": ["**/*"]
  },
  "manifest2": {
    "expoClient": {
      "ios": {
        "buildNumber": "31",
        "supportsTablet": false,
        "bundleIdentifier": "com.kodefox.kflounge"
      },
      "web": {
        "favicon": "./assets/favicon.png"
      },
      "icon": "./assets/icon.png",
      "name": "KF Lounge",
      "slug": "kf-lounge",
      "scheme": "kf-lounge",
      "splash": {
        "image": "./assets/images/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "android": {
        "package": "com.kodefox.kflounge",
        "permissions": ["READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
        "versionCode": 31,
        "googleServicesFile": "./google-services.json"
      },
      "updates": {
        "url": "https://u.expo.dev/74846d43-b313-4543-9590-71704cc3a568",
        "fallbackToCacheTimeout": 0
      },
      "version": "1.1.9",
      "platforms": ["ios", "android"],
      "sdkVersion": "49.0.0",
      "orientation": "portrait",
      "packagerOpts": {
        "config": "metro.config.js",
        "sourceExts": [
          "expo.ts",
          "expo.tsx",
          "expo.js",
          "expo.jsx",
          "ts",
          "tsx",
          "js",
          "jsx",
          "json",
          "wasm",
          "svg"
        ]
      },
      "runtimeVersion": {
        "policy": "sdkVersion"
      },
      "userInterfaceStyle": "automatic",
      "assetBundlePatterns": ["**/*"]
    },
    "scopeKey": "@kfox/kf-lounge"
  }
}
```
