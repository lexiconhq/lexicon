---
title: Verify Push Notifications
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<head>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/plugins/Mobile-PushNotification.png')}/>
</head>

Below, we'll walk you through how you can validate the functionality of push notifications within your Lexicon-powered mobile app.

:::info
In order to properly test push notifications, **you will need two separate accounts** on your Discourse site (to generate notifications).

Additionally, **you will need at least one mobile device** for testing purposes.
:::

## Step

To test push notifications within your Lexicon-powered mobile app, follow these steps:

1. Ensure that you have completed the [Getting Started](../../quick-start) steps for Lexicon.
1. Start the Lexicon Expo app by navigating to `frontend/` and running `yarn start` from your terminal.
1. Using the Expo link or QR Code, launch the app on a real mobile device.
1. Login to the app using one of your accounts.
1. Using that account, create a post within your Discourse site
1. Using a separate account, reply to the post to trigger a notification for the first account.
1. You should receive a push notification on your phone with the reply content from the other account.

<img src={useBaseUrl('/img/screenshot/plugins/Mobile-PushNotification.png')} width="360" />

And that's it! The Lexicon Discourse plugin is properly sending push notifications through your Discourse site.
