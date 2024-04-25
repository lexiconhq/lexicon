---
title: Troubleshooting when trying out the app
---

<head>
 <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Please_connect_network_error.png')}/>
</head>

import useBaseUrl from '@docusaurus/useBaseUrl';

## Troubleshooting Connection and Configuration Issues with URL

<div style={{textAlign: 'center'}}>
  <img loading="eager" alt="please connect to network error" className="carousel-image" src={useBaseUrl('/img/screenshot/Please_connect_network_error.png')}/>
</div>

If you are encountering issues related to the URL, resulting in an error message saying "please connect to network" as shown in the screenshot, it is likely due to incorrect settings. Specifically, if you are attempting to test builds locally on your mobile device and the channel field is not properly configured, the app may continuously fallback to the localDevelopment channel, even if you have set it to something else like "preview."

Here some steps and notes to help resolve this:

- Open the `frontend/Config.ts` file in your project.
- Locate the `config` object within the file.
- In the `localDevelopment` section of the `config` object, you can add the Prose URL specific to the channel you are trying to test. This section is used for local development and as a fallback configuration for unknown build channels in EAS Build. Here's an example:

  ```ts
  const config: Config = {
    localDevelopment: {
      proseUrl: 'http://localhost:8929',
    },
    buildChannels: {
      preview: {
        proseUrl: 'http://PLACEHOLDER.change.this.to.your.prose.url',
      },
      production: {
        proseUrl: 'http://PLACEHOLDER.change.this.to.your.prose.url',
      },
    },
  };
  ```

- The example above shows that the config consists of two main sections: localDevelopment, which specifies the URL during localDevelopment, and buildChannels, which includes configurations for different channels such as preview and production. For local development, it will hit the Prose API with the URL `http://localhost:8929`. If the buildChannel is unknown or not found, it will always default to localDevelopment.
- Update the `proseUrl` value within the desired build channel, such as `preview` or `production`, with the valid and reachable URL of your Prose server.
- Once you have made the necessary changes, save the `frontend/Config.ts` file.

Now, when you run eas build for a specific build channel, such as `eas build --profile=production`, it will utilize the Prose URL specified in the production configuration.

:::note
It is important to include the URL in the `frontend/app.json` file, which expo-updates will use to fetch update manifests. Failing to set the URL in the `frontend/app.json` file will result in the expo-update constant always returning undefined for the channel, causing the app to consistently utilize the localDevelopment URL after building. You can specify this URL in the expo and updates sections of the app.json file. For more detailed information on how to configure this, please refer to the [expo documentation](https://docs.expo.dev/versions/latest/config/app/#url) for more detail on this.

```json
"expo": {
    "updates": {
      ...,
      "url": "https://u.expo.dev/<id project>"
    }
}
```

This configuration is essential for seamless integration with Config.ts in your project.
:::

In certain cases, you may encounter an issue related to Prose API URLs when the channel name specified in the `frontend/eas.json` file does not match the corresponding key name defined in the `config` variable in `frontend/Config.ts`. This discrepancy can lead to problems because the channel name from `eas.json` is used to determine the URL that will be utilized. If the names do not match, the default `localDevelopment` URL will be used instead.

To ensure smooth functioning, it is important to use the same channel name in both the `frontend/eas.json` file and the `frontend/Config.ts` file. This will ensure proper mapping of the channel name to the corresponding URL.

Here is an example to illustrate this:

```json
// frontend/eas.json

"build": {
    "staging": {
      "android": {
        "buildType": "apk"
      },
      "channel": "staging"
    }
}
```

```ts
// frontend/Config.ts;

const config: Config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
    inferDevelopmentHost: true,
  },

  buildChannels: {
    preview: {
      proseUrl: '<url>',
    },
    production: {
      proseUrl: '<url>',
    },
    staging: {
      proseUrl: '<url>',
    },
  },
};
```

## The app closes abruptly after the splash screen

If you encounter a situation where your app closes abruptly after the splash screen, it is likely that there are missing configurations in your `app.json` file. One common cause is the absence of a scheme definition in `app.json`, which is essential during the app build process.

To resolve this issue, follow these steps:

1. Open your project's `frontend/app.json` file.
2. Look for the `"expo"` section.
3. If a scheme is not present add this part in `"expo"` section

  ```json
  "expo":{
    "name": "<app name>",
    "slug": "<app-name>",
    "scheme": "<app-name>",
    "version": "1.0.0"
  }
  ```

  Replace `"<app-name>"` with the desired scheme name for your app.

4. Save the changes to the `app.json` file.
5. Rebuild your app and test it again.

By ensuring that the scheme is correctly defined in `app.json`, you should be able to resolve the issue of the app closing after the splash screen.
