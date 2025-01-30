---
title: Quick Start
---

## Prerequisites

- Node.js 16.14 or newer
- The latest version of NPM or Yarn, compatible with Node 16.14 or newer
- EAS CLI 3.7.2 or newer to build and publish the app
- An active Discourse site
  - If you don’t have one, please follow the instructions in [Development Setup](setup#discourse-host)

:::note
Follow the instructions in [Setup Guidance](tutorial/setup) to install the prerequisite depedencies, such as NPM and the EAS CLI.
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

Note that running `npm run generate` will generate types for the frontend using [GraphQL Code Generator](https://the-guild.dev/graphql/codegen).

- It uses the GraphQL schema located in the `discourse-apollo-rest` folder to generate a new folder called `generatedAPI` inside the `frontend` directory. This folder contains the resulting types for queries and mutations.

- This allows the frontend codebase to leverage the types from the GraphQL API, ensuring type safety and seamless integration with the API.

The generated types are then used by [Apollo](https://github.com/apollographql/apollo-tooling), the GraphQL library employed on the frontend. This integration enables the mobile app to correctly query the API and handle responses.

## Launch the Mobile App

You can run the app and test it out by running this command from the project root:

```
$ npm run quickstart
```

This will simultaneously launch processes:

- The local Expo dev server, which will enable you to launch the React Native app from your device

**Please note that this takes some configuration to setup properly**.

- The `quickstart` command configures the Mobile App to point at https://meta.discourse.org, as an example.

- You'll need to make adjustments to point at a site of your choice.

- The Lexicon Mobile App (via Expo) must be configured to point at the Discourse Server

More details are available in the [Development Setup](setup) section
