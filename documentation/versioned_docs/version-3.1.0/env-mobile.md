---
title: Configuration Values
---

You can check and set the configuration values in `frontend/Config.ts`.

The table below describes the configuration values for the Lexicon Mobile App.

If there is a default value indicated, you do not need to set it.

| Variable             | Required | Notes                                                                                  | Default Value | Example Value(s)                                                                                                                                      |
| -------------------- | -------- | -------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| discourseUrl         | Yes      | The url of the Discourse Server (must start with http or https)                        | -             | https://discourse.myserver.com https://discourse.myserver.com:8080 https://discourse.myserver.com/subpath https://discourse.myserver.com:8080/subpath |
| inferDevelopmentHost | No       | The flag (true / false) to override localhost with the host of the development machine | (empty)       | true                                                                                                                                                  |

## The `config` object

In the `Config.ts` file, you'll find a `config` object that allows you to specify configuration values by scenario.

The two primary scenarios are:

- `localDevelopment`: when developing against the app locally. This configuration is also used as a fallback for an unknown build channel.
- `buildChannels`: used to define configuration by build channel when building the app with the EAS CLI.

Primarily, you'll only be concerned with configuring `discourseUrl` for each of these sections.

## `discourseUrl`

:::caution
`discourseUrl` must always be specified, with or without a port number, and must always start with either `http://` or `https://`.
:::

`discourseUrl` is used to specify the URL of the Discourse.

### Example

```ts
const config = {
  localDevelopment: {
    discourseUrl: 'http://localhost:4200',
  },
  buildChannels: {
    preview: {
      discourseUrl: 'https://preview.myserver.com',
    },
    production: {
      discourseUrl: 'https://discourse.myserver.com',
    },
  },
};
```

With this configuration above, the app will:

- point at `http://localhost:4200` when you run the app using `npm run start`
- point at `https://preview.myserver.com` when you build the app using `eas build --profile preview`
- point at `https://discourse.myserver.com` when you build the app using `eas build`

`discourseUrl` also can include a subpath if desired:

```ts
const config = {
  localDevelopment: {
    discourseUrl: 'http://localhost:4200',
  },
  buildChannels: {
    preview: {
      discourseUrl: 'https://preview.myserver.com:8080/subpath',
    },
    production: {
      discourseUrl: 'https://discourse.myserver.com',
    },
  },
};
```

**Different Behavior in Development**

When running the app locally, if `discourseUrl` is set to `http://localhost` or `http://127.0.0.1`, it will automatically be replaced with `http://10.0.2.2` when accessed from an Android device or emulator. This ensures the Android emulator can connect to the local development server hosted on your machine.

_Note: This behavior applies only during local development for android and does not affect production builds._

This approach resolves the issue where `localhost` inside the Android emulator does not point to your development machine. This happens due to network isolation. Android emulators run in a virtualized environment, meaning they are isolated from the host system. The IP address `localhost` (or `127.0.0.1`) inside the emulator points to the emulator itself, not the host machine.

If you are interested in more details about this, the implementation of this behavior is available in `frontend/constants/app.ts`.

This behavior of automatically overriding those values can be disabled, with `inferDevelopmentHost`, which is covered below.

## `inferDevelopmentHost` {#infer_development_host}

:::info
This flag is only valid under `localDevelopment`. It has no effect when used as part of `buildChannels`.
:::

When in development, by default, the Lexicon Mobile App will check to see if `discourseUrl` is set to either `http://localhost` or `http://127.0.0.1`.

When detected, either of those values will be overwritten with `http://10.0.2.2` if android.

For scenarios where this behavior is not desirable, `inferDevelopmentHost` can be used as a flag to disable this behavior. It can be disabled by specifying the value as `false`.

When set to `false`, this behavior of overriding `discourseUrl` with `http://10.0.2.2` will no longer occur, and the original value will be passed through as-is.

```ts
const config = {
  localDevelopment: {
    discourseUrl: 'http://localhost:4200',
    inferDevelopmentHost: false,
  },
};
```
