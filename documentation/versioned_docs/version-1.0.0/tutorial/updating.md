---
title: Update your App
---

## EAS Update

EAS Update is the successor to `expo publish`. This service helps to update projects using the `expo-updates` library.

In particular, it enables you to push quick fixes to your users in between full-fledged app store submissions.

With EAS Update, there is no need to recompile the app with its non-native parts, such as TypeScript code, styling, or image assets. [Click here](https://docs.expo.dev/eas-update/introduction/) to learn more about EAS Update.
:::note
You are required to build the app with [EAS Build](building) before using the EAS Update.
:::

### Configuration

Let's get started by configuring EAS update. Feel free to check out the [complete guide](https://docs.expo.dev/build-reference/build-configuration/) from Expo for further details.

```bash
eas update:configure
```

Running this command will add `expo.updates.url` and `runtimeVersion.policy` in `app.json`.

:::caution

As mentioned in the [Expo documentation](https://docs.expo.dev/build/updates/#previewing-updates-in-development-builds), you can no longer launch your app in Expo Go (using `expo start`) after adding the `runtimeVersion` field in `app.json`. It is recommended to use `expo-dev-client` instead to create a development build.

```bash
eas -p all -e development
```

or if you still wish to use Expo Go, please remove `runtimeVersion` field from `app.json` before running `expo start`.
:::

### Updating

After making the necessary changes, you can push updates using this command:

```bash
eas update –-branch <branch> –-message “<message>”
```

The branch name here is the same as the build profile name when building the app.
For example, if you had previously built the app with this command:

```bash
eas build –p all –e preview
```

Then you can later update it using:

```bash
eas update –-branch preview –-message “Fixing typos”
```

Once the update is complete, force close and reopen the installed app twice to view the update.

## All Done! 🙌

That's it for the tutorial. Great work.

We hope that this has served as an informative guide to help familiarize you with Lexicon and how you can make use of it.

If you haven't already, check out the [Lexicon Documentation](../) to get a deeper understanding of the project and how it all works.

If you have any questions, comments, feedback, or want to contribute, please reach out to us on Github!
