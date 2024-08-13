# Detox E2E Testing Lexicon

## Motivation

Detox is a powerful end-to-end testing tool for mobile apps that provides automated testing capabilities to ensure app quality. The main purpose of using Detox is to tackle bug in app. By simulating user interactions, Detox helps identify bugs and issues early in the development cycle, thereby saving valuable time and effort.

## Setup Detox

In order to set up Detox for your project, you will need to install some packages on your computer and project. For macOS users, run the following commands in your terminal:

```
brew tap wix/brew
brew install applesimutils
```

Next, you will need to install the Detox CLI globally using either Yarn or npm:

```
yarn global add detox-cli
# or
npm install detox-cli --global
```

In the Lexicon project, the setup differs slightly from the standard Detox documentation as Lexicon uses Expo. To run Detox with Expo, you will need to install the @config-plugins/detox package, which allows for automatic setup of the native project for Detox configuration. You can find this package on npm.

To set up Detox for Lexicon, follow these steps:

1. Install the Detox package for lexicon:

   > **Note**
   > to install correct detox version check this documentation https://www.npmjs.com/package/@config-plugins/detox

   ```
   yarn add detox --dev
   ```

2. Install other dependencies required for Detox:

   ```
   yarn add @config-plugins/detox @types/detox --dev
   ```

3. Add the Detox config plugin to your frontend/app.json file:

   ```
   {
     "plugins": ["@config-plugins/detox"]
   }
   ```

4. Run `detox init -r jest` in your terminal. This command will create an e2e folder, which contains the Detox configuration for running tests, as well as the .detoxrc.js file to set up the iOS and Android test file paths and simulator types.

## Using Graphql Mock In Detox

For end-to-end (E2E) testing in this project, we make use of a mock GraphQL server. You can find all the setup and mock data in the frontend/e2e/apollo-mock/ directory. If you need to modify the resolver logic, data, or Port for Detox mock tests, you can make the required changes in that folder.

## Using config mock file

To differentiate the URL between local development and Detox tests, we created a file called `Config.mock.ts`. This file contains the same function `getProseUrl` as found in `Config.ts`. If the environment variable `DETOX_TESTS` is set to `true` when running `expo star --dev-client` or in package.json script run `yarn start:android:test` (which is required for Android), the function will be overridden with the mock which we create.

The configuration condition for this behavior is located in the metro.config.js file.

For more detailed information on how to use and set up this configuration, you can refer to the following link: https://github.com/wix/Detox/blob/master/docs/guide/mocking.md

## How to run Lexicon's Detox tests locally

To run Detox tests for Lexicon in your local environment, follow these steps:

#### iOS

1. Add the `bundleIdentifier` to your Lexicon project's app.json file. Also, ensure that you have set up other configurations such as the EAS project ID or your project name for building using EAS.

2. Build your app using the command eas build -p ios --profile=test. If you are using a different channel, make sure to add the simulator configuration to your eas.json file under the iOS section:

   ```
   "ios": {
           "simulator": true
     }
   ```

3. After the EAS build is complete, download and unzip the app.

4. Inside the frontend folder, create a new folder named bin/IOS.

   > **Note**
   > For folder name you can change it but don't forget to change the `binaryPath` in file `frontend/.detoxrc.js`
   >
   > ```
   > {
   >  "apps":{
   >        "ios.debug": {
   >         "type": "ios.app",
   >         "binaryPath": "bin/IOS/insertyourappname.app",
   >       },
   >   },
   > }
   > ```

5. Move the downloaded app into the bin/IOS folder.

6. Open the frontend/.detoxrc.js file and set the binary path for iOS:

   ```
   {
       "apps":{
           "ios.debug": {
             "type": "ios.app",
             "binaryPath": "bin/IOS/insertyourappname.app",
           },
       },
       "configurations": {
           "ios.sim.debug": {
             "device": "simulator",
             "app": "ios.debug"
           },
       }
   }
   ```

7. Change the iOS simulator device in the `frontend/.detoxrc.js`n file based on the simulator installed on your local machine:

   ```
   "devices": {
           "simulator": {
             "type": "ios.simulator",
             "device": {
               "type": "iPhone 13"
             }
           },
       }
   ```

8. Open your terminal, navigate to the frontend directory, and run the command `detox test -c ios.sim.debug`. Wait until the tests finish executing.

These steps will allow you to run Detox tests for Lexicon on iOS in your local development environment.

#### android

1. To run Detox tests locally on Android, you first need to execute the command `expo prebuild --platform android`.

2. Next, run either of the following commands to build the Detox test suite for Android: `detox build -c android.emu.debug or yarn tests:android:build`.

3. Update the Android emulator device in the frontend/.detoxrc.js file based on the emulator installed on your local machine. Modify the device configuration as follows:

   ```
   "devices": {
       "emulator": {
         "type": "android.emulator",
         "device": {
           "avdName": "Pixel_5_API_28"
         }
       }
     },
   ```

4. Open your terminal, navigate to the frontend directory, and run the command `yarn start`. After that open other terminal with directory frontend and run `yarn tests:android:test`. Wait until the tests finish executing.

## Troubleshooting

in lexicon there are some need to pay attention about detox test and setup especially for android

1. if you get error `Detox can't seem to connect to the test app`. can be issue where your android native missing some configuration to run detox. You can check all additional configuration file on android in this [documentation](https://wix.github.io/Detox/docs/introduction/project-setup#step-4-additional-android-configuration). In lexicon project if this configuration missing make sure you already add @config-plugin/detox in app.json

   ```
   {
     "plugins": ["@config-plugins/detox"]
   }
   ```

2. Some tests will not work on Android if you are using Emulator API 33, and this issue is still open in this [issue](https://github.com/wix/Detox/issues/3762). Specifically, the typeText and tap functions do not work or may crash the app when attempting to run the test. I suggest trying to use Emulator API 31 or 28, which I have tested and confirmed to work properly.

3. If you encounter an error stating "No elements found" even though your setup and elements are correct at the start of the test, consider following this suggestion. This issue may occur when running Detox tests in a CI environment.

   To resolve this issue, try opening the simulator first before running the Detox test. This step can help ensure that the necessary elements are loaded properly and available for interaction during the test execution.

   ```
   Test Failed: No elements found for “MATCHER(id == “password_text_input”)”
   ```

4. if you encounter problem tap test in android. I suggest to check some this thing

- make sure the button is not hide because keypad or other component because it will make the tap not working
- if you use animation I suggest to add wait time in your test so it will finish load your component before run the test

5. If you encounter issues connecting to your local API server when running tests, please ensure that you have configured the necessary settings for traffic handling as described in this [traffic configuration guide](https://wix.github.io/Detox/docs/introduction/project-setup#43-enabling-unencrypted-traffic-for-detox).

   Additionally, make sure that you are using the appropriate API URL for local testing with a local API. In this case, you should use http://10.0.2.2 as the URL to access your local API server.

6. if you want to add CI script for run detox test in android make sure your runner support hardware acceleration to be able run android emulator. if not you will encounter some of this error

   ```
   PANIC: Avd's CPU Architecture 'arm64' is not supported by the QEMU2 emulator on x86_64 host.

   ERROR   | x86 emulation currently requires hardware acceleration!
   ```

   when try setup or run emulator
