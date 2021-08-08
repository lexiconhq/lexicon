## Lexicon

Lexicon is a customizable, open source mobile app that provides an elegant mobile discussions experience. Built on top of [Discourse](#what-is-discourse), a platform for communities.

### Benefits

- Launch a mobile app customized for your Discourse site
- Increase engagement with your users by adding a mobile experience
- Built with React Native: designed from the ground up for a mobile first experience - no webviews!

### What is Discourse?

Discourse is open-source **forum software** that is thoughtfully designed, simple to setup, and well-maintained.

You can learn more about it on the [Discourse website](https://www.discourse.org/).

## Installation

Clone the repository and navigate into it:

```
git clone git@github.com:lexiconhq/lexicon.git
cd lexicon
```

Next, execute the following command.

```
$ yarn && yarn generate
```

`yarn` will install the dependencies needed, while `yarn generate` will launch two processes sequentially.

- First, it will generate a GraphQL [schema](https://nexusjs.org/docs/guides/schema) in the `api` directory.

- Then it will create a new folder called `generated` in the `frontend` directory. This contains the GraphQL query and mutation types based on the schema generated above. Click [here](https://github.com/apollographql/apollo-tooling#apollo-clientcodegen-output) to learn more about this process.

## Quick Start

You can run the Lexicon Mobile App and test it out by running this command from the project root:

```
$ npm run quickstart
```

This will simultaneously launch two processes:

- The Prose GraphQL API Server
- The local Expo dev server, which will enable you to launch the React Native app from your device

The `quickstart` commands are designed to point at an existing Discourse server, [Discourse Meta](https://meta.discourse.org).

Configuring it to point at your own Discourse site will take additional configuration.

You can learn more about this in the [Lexicon Documentation](https://docs.lexicon.is/quick-start).

## Documentation

The full documentation for Lexicon is located at [docs.lexicon.is](https://docs.lexicon.is).

If you'd like to contribute to it, or just wnat to browse it locally, you can run the following command from the project root:

```
yarn docs:start
```
