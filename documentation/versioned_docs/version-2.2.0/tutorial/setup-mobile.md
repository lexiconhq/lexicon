---
title: Configure & Launch the Mobile App
---

import useBaseUrl from '@docusaurus/useBaseUrl';

After following the **[Setup the Prose GraphQL API](install-prose)** section, your GraphQL API should now be connected to your Discourse site.

Next, we'll guide you through the process of connecting the Lexicon Mobile App to your Discourse site via Prose.

### Mobile App Configuration

:::note
In the original release of Lexicon, the **Prose URL** was specified in `frontend/.env`. However, as part of migrating to Expo's EAS feature, we centralized the configuration into `frontend/Config.ts` to save you the trouble of needing to maintain it in more than one place, as suggested in the [Expo documentation](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)
:::

Before launching your local version of the Lexicon Mobile App, you'll need to configure it with at least one piece of information.

The Lexicon Mobile app relies exclusively on a running instance of the Prose GraphQL API in order to retrieve data from your Discourse instance.

Therefore, you'll need to instruct it on how to locate your running Prose server.

In development, it is common to have it running locally. However, if you have already deployed Prose
somewhere, feel free to use that.

#### Configuring `proseUrl` via `config`

:::caution

##### `proseUrl` requirements

It is worth noting that `proseUrl` **must** start with either `http://` or `https://`.

If it does not, the Mobile App will throw an error when launching.
:::

`Config.ts` contains the `config` object, which allows you to specify the Prose URL for each scenario encountered when developing and building the Mobile App.

The specific configuration value which enables this is `proseUrl`, and it is contained within each scenario expressed by the `config` object.

```ts
const config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://preview.myserver.com:8080/subpath',
    },
    production: {
      proseUrl: 'https://myserver.com/api/prose',
    },
  },
};
```

As mentioned earlier—above, the `config` object allows us to express configuration values for multiple scenarios, which are:

- `localDevelopment`: when developing against the app locally. This configuration is also used as a fallback for an unknown build channel.
- `buildChannels`: used to define configuration by build channel when building the app with the EAS CLI.

`buildChannels` makes use of Expo's build channels (typically `preview` and `production`) as its keys.

Each key within `buildChannels` maps to a specific Prose URL, which will be used for the build version based on which channel you build for.

From the example above, when we create a `preview` build, the app will be built and configured to contact a Prose server located at `https://preview.myserver.com:8080/subpath`.

The example above expresses a setup in which each build has its own deployed Prose server. However, it is also common to use one server for all scenarios, including development.

```ts
const config = {
  localDevelopment: {
    proseUrl: 'https://myserver.com/api/prose',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://myserver.com/api/prose',
    },
    production: {
      proseUrl: 'https://myserver.com/api/prose',
    },
  },
};
```

##### Port Number

Bear in mind that if your Prose server is not running on port 80 or 443, you also need to specify the **port number** via `proseUrl`.

For example, if you've started a Prose server **locally** on port `8929` and try to run it using `expo start`, your `Config.ts` file would contain `http://myserver.com:8929/api/prose` under `localDevelopment.proseUrl`.

### Launch the Mobile App

Once you have configured everything, you'll want to launch the Mobile App to test that it is speaking to the right Prose server.

To do this, you can simply run the following from the project root:

```bash
npm run --prefix frontend start
```

The Expo development server should launch, and you can follow the instructions to run the app in a simulator or on your actual device.

#### Troubleshooting

If the app throws an error upon loading, you should double-check the configuration values you specified, according to the message you've received.

If the app loads, but you're unable to actually connect, you should verify the following:

- Your Prose Server is up and running at the location you provided to the Lexicon Mobile App
- Your Prose Server is configured to point at an accessible Discourse instance
- Your Discourse instance is up and running correctly

## Nice Work!

At this point, you've already accomplished a lot.

The Discourse server you started off with is now accessible in a new way from a sleek native mobile app, and you're free to customize it to your heart's content.

In the next part of the tutorial, we'll briefly get into that very topic: customizing the Mobile App to [white label](white-label) it for your brand.
