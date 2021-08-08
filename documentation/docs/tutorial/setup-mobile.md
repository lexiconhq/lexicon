---
title: Configure & Launch the Mobile App
---

import useBaseUrl from '@docusaurus/useBaseUrl';

After following the **[Install the Prose GraphQL API](install-prose)** section, your GraphQL API should now be connected to your Discourse site.

Next, we'll guide you through the process of connecting the Lexicon Mobile App to your Discourse site via Prose.

### Mobile App Configuration

Before launching your local version of the Lexicon Mobile App, you'll need to configure it with at least one piece of information.

The Lexicon Mobile app relies exclusively on a running instance of the Prose GraphQL API in order to retrieve data.

Therefore, you'll need to instruct it on where your Prose server is running.

In development, it is common to have it running locally. However, if you have already deployed Prose somewhere, you are free to use that.

The environment variable which instructs the Mobile App on how to find your Prose server is `MOBILE_PROSE_HOST`.

Additionally, `MOBILE_PROSE_PORT` is present to define a non-standard port number, such as `8080`.

As is typical with environment variables, there is more than one way to provide this to the process you want to run.

#### Pass the value when launching Expo

:::info
This only works if you invoke `expo` directly from within `frontend/`. If you use a command like `npm run start`, the environment variable will not be forwarded to Expo.
:::

You can pass an environment variable to the `expo start` command.

```bash
MOBILE_PROSE_HOST=https://prose.myserver.com expo start
```

#### Define a `.env` File (recommended)

The preferred way to specify `MOBILE_PROSE_HOST` is to create a `.env` file in the `frontend/` directory.

```bash
MOBILE_PROSE_HOST=http://your.prose.site

# The Port Number of your Prose server, if needed
MOBILE_PROSE_PORT=8999
```

To do this, from the root of the project, make a copy of `frontend/.env.example`, and name it `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

Bear in mind that if you are not running on port 80 or 443, you also need to specify the **port number** via `MOBILE_PROSE_PORT`.

For example, if you've started a Prose server **locally** on port `8999`, your `.env` file would contain.

```bash
MOBILE_PROSE_HOST=http://localhost
MOBILE_PROSE_PORT=8999
```

The Lexicon Mobile app will throw an error upon starting if any of the following is true:

- `MOBILE_PROSE_HOST` is not set
- `MOBILE_PROSE_HOST` does not start with `http://` or `https://`

### Launch the Mobile App

Once you have configured everything, you'll want to launch the Mobile App to test that it is speaking to the right Prose server.

If you have declared a `frontend/.env` file, you can simply run

```bash
npm run --prefix frontend start
```

If you want to pass in values directly, you should run:

```bash
cd frontend
MOBILE_PROSE_HOST=https://prose.yoursite.com expo start
```

The Expo development server should launch, and you can follow the instructions to run the app in a simulator or on your actual device.

If the app throws a relevant error upon loading, you should double-check the environment variables you specified, according to the message you've received.

If the app loads, but you're unable to actually connect, you should check the following:

- Your Prose Server is up and running at the location you provided to the Lexicon Mobile App
- Your Prose Server is configured to point at an accessible Discourse instance
- Your Discourse instance is up and running correctly

## Nice Work!

At this point, you've already accomplished a lot.

The Discourse server you started off with is now accessible in a new way from a sleek native mobile app, and you're free to customize it to your heart's content.

As the last part of the tutorial, we'll briefly get into that very topic: customizing the Mobile App to white label it for your brand.
