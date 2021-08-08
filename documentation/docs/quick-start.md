---
title: Quick Start
---

## Prerequisites

- Node.js 12.19.0 or newer
- The latest version of NPM or Yarn, compatible with Node 12.19.0 or newer
- Expo-CLI 3.22.1 or newer
- An active Discourse site
  - If you don’t have one, please follow the instructions in [Development Setup](setup#discourse-host)

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

This is a necessary process from our tooling, [Apollo](https://github.com/apollographql/apollo-tooling).

To learn more about this process, check out the [apollo client:codegen](https://github.com/apollographql/apollo-tooling#apollo-clientcodegen-output) documentation.
Click [here](https://github.com/apollographql/apollo-tooling#apollo-clientcodegen-output) to learn more about why we do this.

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
