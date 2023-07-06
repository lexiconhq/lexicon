---
title: Test Email Deep Linking
slug: testing-email-deep-linking
---

import useBaseUrl from '@docusaurus/useBaseUrl';

This guide will provide you with step-by-step instructions to help you validate the functionality of email deep linking within your Lexicon mobile app.

**Please note that in order for email deep linking to function properly, you will need two separate accounts (to generate notifications from activity on your site). Additionally, you will need at least one mobile device to verify that email deep links open your Lexicon-powered mobile app as expected.**

## Steps

To test email deep linking within your Lexicon-powered mobile app, follow these steps:

1. Log in to the mobile app using one of your accounts.
2. Create a post using the app or Discourse site.
3. If you create a post using the app, try replying to the post using another account on a different device or web browser. If you create a post using the website, try replying to the post using an account on the mobile app first, and then reply again using an account on the Discourse site.
4. You will receive an email notification about the activity from the other account.
5. On your mobile device, open the email you received from Discourse about the notification.
6. Click on the button that says "Visit Message" or "Visit Topic". The label depends on what activity generated the email.

<div style={{textAlign: 'center'}}>
    <img width="400"  src={useBaseUrl('/img/screenshot/Discourse-Plugin-Email-notification.png')} />
</div>

7. The link will first open in your mobile web browser. Provided that the Lexicon-powered mobile app is installed and matches the configured app scheme, it should automatically open to the relevant topic or message scene.

And that's it! You have successfully completed the steps to enable and test email deep linking in your app.
