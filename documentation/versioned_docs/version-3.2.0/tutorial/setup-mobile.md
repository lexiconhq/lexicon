---
title: Configure & Launch the Mobile App
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Now that we have a running Discourse instance to interact with, let's walk through the process of connecting the Lexicon Mobile App to your Discourse site.

### Mobile App Configuration

:::note
In the initial release of Lexicon, connecting to a Discourse site required setting up Prose and configuring the Prose URL in the mobile app. However, with recent updates, the mobile app now connects directly to Discourse without needing Prose.
:::

#### Configuring `discourseUrl` via `config`

:::caution

##### `discourseUrl` requirements

It is worth noting that `discourseUrl` **must** start with either `http://` or `https://`.

If it does not, the Mobile App will throw an error when launching.
:::

`Config.ts` contains the `config` object, which allows you to specify the Discourse URL for each scenario encountered when developing and building the Mobile App.

The specific configuration value which enables this is `discourseUrl`, and it is contained within each scenario expressed by the `config` object.

```ts
const config = {
  localDevelopment: {
    discourseUrl: 'http://localhost:4200',
  },
  buildChannels: {
    preview: {
      discourseUrl: 'https://preview.discourseserver.com',
    },
    production: {
      discourseUrl: 'https://discourseserver.com',
    },
  },
};
```

As mentioned earlier—above, the `config` object allows us to express configuration values for multiple scenarios, which are:

- `localDevelopment`: when developing against the app locally. This configuration is also used as a fallback for an unknown build channel.
- `buildChannels`: used to define configuration by build channel when building the app with the EAS CLI.

`buildChannels` makes use of Expo's build channels (typically `preview` and `production`) as its keys.

Each key within `buildChannels` maps to a specific Discourse URL, which will be used for the build version based on which channel you build for.

From the example above, when we create a `preview` build, the app will be built and configured to contact a Discourse server located at `https://preview.discourseserver.com`.

The example above expresses a setup in which each build has its own deployed Discourse server. However, it is also common to use one server for all scenarios, including development.

```ts
const config = {
  localDevelopment: {
    discourseUrl: 'https://discourseserver.com',
  },
  buildChannels: {
    preview: {
      discourseUrl: 'https://discourseserver.com',
    },
    production: {
      discourseUrl: 'https://discourseserver.com',
    },
  },
};
```

### Launch the Mobile App

Once you have configured everything, you'll want to launch the Mobile App to test that it is speaking to the right Discourse server.

To do this, you can simply run the following from the project root:

```bash
npm run --prefix frontend start
```

The Expo development server should launch, and you can follow the instructions to run the app in a simulator or on your actual device.

#### Troubleshooting

If the app throws an error upon loading, you should double-check the configuration values you specified, according to the message you've received.

If the app loads, but you're unable to actually connect, you should verify the following:

- Your Discourse Server is up and running at the location you provided to the Lexicon Mobile App
- Your Discourse Server is configured to point at an accessible Discourse instance
- Your Discourse instance is up and running correctly

## Nice Work!

At this point, you've already accomplished a lot.

The Discourse server you started off with is now accessible in a new way from a sleek native mobile app, and you're free to customize it to your heart's content.

In the next part of the tutorial, we'll briefly get into that very topic: customizing the Mobile App to [white label](white-label) it for your brand.
