---
title: Quick Start
---

## Prerequisites

- Node.js 16.14 or newer
- The latest version of NPM or Yarn, compatible with Node 16.14 or newer
- Expo CLI 6.0.6 or newer
- EAS CLI 2.6.0 or newer to build and publish the App
- An active Discourse site
  - If you don’t have one, please follow the instructions in [Development Setup](setup#discourse-host)

:::note
Follow the instructions in [Setup Guidance](tutorial/setup) to install the prerequisite depedencies, such as NPM, the Expo CLI, and the EAS CLI.
:::

## Installation

Clone the repository and navigate into it:

```
git clone git@github.com:lexiconhq/lexicon.git
cd lexicon
```

Next, install the project's dependencies and generate its GraphQL schema:

```
$ npm install && npm run generate
```

Note that `npm run generate` involves two steps.

- First, it will generate a [GraphQL schema](https://nexusjs.org/docs/guides/schema) in the `api` directory.

- Then, using the generated schema, it will create a new folder called `generated` in the `frontend` directory, containing the resulting query and mutation types.

- This allows the frontend codebase to stay in sync with, and not duplicate the code for, the types from the `api` directory.

The code shared from the API is then used by [Apollo](https://github.com/apollographql/apollo-tooling), the GraphQL library we use on the frontend, which enables the Mobile App to query the API correctly.

## Launch the Mobile App

You can run the app and test it out by running this command from the project root:

```
$ npm run quickstart
```

This will simultaneously launch two processes:

- The Prose GraphQL API Server
- The local Expo dev server, which will enable you to launch the React Native app from your device

**Please note that this takes some configuration to setup properly**.

- The `quickstart` command configures the Mobile App and the Prose GraphQL API to point at https://meta.discourse.org, as an example.

- You'll need to make adjustments to point at a site of your choice.

- The Lexicon Mobile App (via Expo) must be configured to point at the Prose GraphQL Server

- The Prose GraphQL Server must be configured to point at an active Discourse instance

More details are available in the [Development Setup](setup) section
