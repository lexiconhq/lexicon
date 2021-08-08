---
title: Environment Variables
---

The table below lays out environment variables for the Lexicon Mobile App.

If there is a default value indicated, you do not need to set it.

| Environment Variable | Required | Notes                                                            | Default Value | Example Value              |
| -------------------- | -------- | ---------------------------------------------------------------- | ------------- | -------------------------- |
| MOBILE_PROSE_HOST    | Yes      | The hostname of the Prose Server (must start with http or https) | -             | https://prose.myserver.com |
| MOBILE_PROSE_PORT    | No       | The port of the Prose Server                                     | (empty)       | 8080                       |

## `MOBILE_PROSE_HOST`

Note that `MOBILE_PROSE_HOST` must always be specified, and must always start with either `http://` or `https://`.

Otherwise The Lexicon Mobile App has no idea what server to talk to in order to interact with Discourse.

**Different Behavior in Development**

If the Mobile App detects that `NODE_ENV` is not `production`, then it will adjust its behavior slightly if `MOBILE_PROSE_HOST` is making use of `localhost` or `127.0.0.1`.

In this case, a replacement will be made using Expo's `debuggerHost` constant, which is used to locate the IP address of your development machine.

This addresses multiple issues:

- Accessing `localhost` from within the Android simulator does not map to your development machine
- Accessing `localhost` from a device running Expo Go does not map to your development machine, requiring you to manually identify and specify your development machine's IP address with `MOBILE_PROSE_HOST`.

If you are interested in more details about this, the implementation of this behavior is available in `frontend/constants/app.ts`.

## `MOBILE_PROSE_PORT`

`MOBILE_PROSE_PORT` is used to allow explicitly specifying the port number.

```bash
MOBILE_PROSE_HOST=http://localhost
MOBILE_PROSE_PORT=8999
```

If it is not set, only `MOBILE_PROSE_HOST` will be used to derive the host of the Prose

This presents a situation where you could omit `MOBILE_PROSE_PORT` and still specify a port number, if you desired:

```bash
MOBILE_PROSE_HOST=http://localhost:8999
```
