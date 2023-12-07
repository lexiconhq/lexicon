---
title: Setup your Development Machine
---

## Install NodeJS

If you haven't already, install NodeJS on your machine.

The tooling needed to setup Lexicon relies heavily on Node and npm.

If you are unsure of how to install NodeJS, you can follow the instructions on the [NodeJS Website](https://nodejs.org/en/download/).

#### Supported Node Versions

It is recommended that you perform this tutorial using the latest version of Node that is compatible with the the project's version of Expo.

You can always confirm this by viewing the dependencies in [frontend/package.json](https://github.com/lexiconhq/lexicon/blob/master/frontend/package.json).

If your setup doesn't allow you to easily change your current Node version, we would recommend making use of [`nvm`](https://github.com/nvm-sh/nvm) to quickly switch between Node versions.

### Install yarn, if you prefer

Lexicon doesn't leverage any special features of [Yarn](https://yarnpkg.com/) - the alternative package manager for Node. If you prefer it, it will work the same as running `npm install`.

For the purposes of this tutorial, we will demonstrate all commands using `npm`.

### Clone the Lexicon Repository

In a desirable location on your development machine, clone the Lexicon repository and `cd` into it.

```sh
git clone git@github.com:lexiconhq/lexicon.git
cd lexicon
```

### Install Dependencies

Next, install Lexicon's dependencies:

```sh
npm install
```

This will install dependencies for both the Mobile App and the backend GraphQL API, Prose.

### Install the Expo CLI

[Expo](https://expo.io/) is the phenomenal toolchain that Lexicon uses to develop and build the Mobile App.

We will later use the Expo CLI to launch the Mobile App - either on your device or in a simulator.

You can install the Expo CLI with the following command:

```sh
npm install --global expo-cli
```

Further information is available in the [Expo docs](https://docs.expo.io/).

Then, verify that Expo is available in your `PATH` with the following:

```sh
$ expo --version
<current version will be displayed>
```

### Install the EAS CLI

[Expo Application Services (EAS)](https://expo.dev/eas/) is an integrated set of cloud services for Expo and React Native apps.

We will use the EAS CLI to build and publish the Mobile App.

You can install the EAS CLI with the following command:

```sh
npm install --global eas-cli
```

Further information is available in the [Expo docs](https://docs.expo.dev/eas/).

Then, verify that EAS is available in your `PATH` with the following:

```sh
$ eas --version
eas-cli/<current version>
```

### Ready to Go!

That's all we need for this step.

Next, there is an optional guide to help you if you're not too familiar with setting up a server on a cloud provider.

You're free to skip this if you're already adept at this process.

After that, we'll look into how we can prepare Discourse to connect with the Lexicon Mobile App.

If you don't already have a Discourse server setup, we'll get into that as well.
