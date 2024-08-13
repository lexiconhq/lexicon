---
title: Configuration Values
---

You can check and set the configuration values in `frontend/Config.ts`.

The table below describes the configuration values for the Lexicon Mobile App.

If there is a default value indicated, you do not need to set it.

| Variable             | Required | Notes                                                                                  | Default Value | Example Value(s)                                                                                                                      |
| -------------------- | -------- | -------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| proseUrl             | Yes      | The url of the Prose Server (must start with http or https)                            | -             | https://prose.myserver.com https://prose.myserver.com:8080 https://prose.myserver.com/subpath https://prose.myserver.com:8080/subpath |
| inferDevelopmentHost | No       | The flag (true / false) to override localhost with the host of the development machine | (empty)       | true                                                                                                                                  |

## The `config` object

In the `Config.ts` file, you'll find a `config` object that allows you to specify configuration values by scenario.

The two primary scenarios are:

- `localDevelopment`: when developing against the app locally. This configuration is also used as a fallback for an unknown build channel.
- `buildChannels`: used to define configuration by build channel when building the app with the EAS CLI.

Primarily, you'll only be concerned with configuring `proseUrl` for each of these sections.

## `proseUrl`

:::caution
`proseUrl` must always be specified, with or without a port number, and must always start with either `http://` or `https://`.
:::

`proseUrl` is used to specify the URL of the Prose GraphQL API.

The Prose GraphQL API acts a middleman between the Lexicon Mobile App and your Discourse instance. Without it, the mobile app cannot interact with your Discourse instance.

### Example

```ts
const config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://preview.myserver.com',
    },
    production: {
      proseUrl: 'https://prose.myserver.com',
    },
  },
};
```

With this configuration above, the app will:

- point at `http://localhost:8929` when you run the app using `npm run start`
- point at `https://preview.myserver.com` when you build the app using `eas build --profile preview`
- point at `https://prose.myserver.com` when you build the app using `eas build`

`proseUrl` also can include a subpath if desired:

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

**Different Behavior in Development**

When running the app locally, if `proseUrl` is set to `http://localhost` or `http://127.0.0.1`, it will replace `proseUrl` with the IP address of your development machine. It does this by using Expo's `debuggerHost` constant.

_Note: this does not apply when building the app._

This addresses multiple issues:

- Accessing `localhost` from within the Android simulator does not map to your development machine
- Accessing `localhost` from a device running Expo Go does not map to your development machine

Both of these scenarios would otherwise require you to manually identify and specify your development machine's IP address with `proseUrl`. This is bothersome since your machine's IP address can change over time.

If you are interested in more details about this, the implementation of this behavior is available in `frontend/constants/app.ts`.

This behavior of automatically overriding those values can be disabled, with `inferDevelopmentHost`, which is covered below.

## `inferDevelopmentHost`

:::info
This flag is only valid under `localDevelopment`. It has no effect when used as part of `buildChannels`.
:::

When in development, by default, the Lexicon Mobile App will check to see if `proseUrl` is set to either `http://localhost` or `http://127.0.0.1`.

When detected, either of those values will be overwritten with the IP address of your development machine.

This is a very useful feature that makes on-device testing simply work out of the box without needing to manually specify your IP address (or update it when it changes).

For scenarios where this behavior is not desirable, `inferDevelopmentHost` can be used as a flag to disable this behavior. It can be disabled by specifying the value as `false`.

When set to `false`, this behavior of overriding `proseUrl` with the development machine's IP address will no longer occur, and the original value will be passed through as-is.

```ts
const config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
    inferDevelopmentHost: false,
  },
};
```
