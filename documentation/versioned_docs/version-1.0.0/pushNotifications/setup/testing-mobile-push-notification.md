---
title: Test that Push Notifications are Working
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<head>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Mobile-PushNotification.png')}/>
</head>

This guide will provide you with step-by-step instructions to help you validate the functionality of push notifications within your Lexicon Expo app

**Please note that in order for push notifications to function properly, you will need two separate accounts (to generate notifications from activities on your site). Additionally, you will need at least one mobile device for testing purposes.**

## Step

To test push notifications within your Lexicon-powered mobile app, follow these steps:

1. Ensure that you have completed the ["Getting Started"](https://docs.lexicon.is/quick-start) steps for Lexicon.
2. Start the Lexicon Expo app by running `yarn start` in your terminal.
3. Run the app on a real device.
4. Log in to the app using one of your accounts.
5. Create a post using discourse site.
6. try replying to the post using an account on the mobile app first, and then reply again using an account on the Discourse site.
7. You will receive a push notification on your phone with the reply content from the other account.

<img src={useBaseUrl('/img/screenshot/Mobile-PushNotification.png')} />

And that's it! You have successfully completed the steps to enable and test push notifications in your app.
