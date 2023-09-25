---
title: Verify Email Deep Linking
slug: verify-email-deep-linking
---

import useBaseUrl from '@docusaurus/useBaseUrl';

:::note
The steps below assume that **you have already published your Lexicon-powered mobile app** to the App Store and/or Google Play Store **with the correct app scheme**. If you are running the app on your machine locally through Expo, you should not expect the steps to work.
:::

This guide will provide you with step-by-step instructions to help you validate the functionality of email deep linking within your Lexicon mobile app.

## Pre-requisites

:::note
If you have not yet fulfilled all of the pre-requisites below, this test will not work as expected.
:::

In order to test email deep linking properly:

1. You **must** have already published your Lexicon-powered mobile app to the App Store and/or Google Play Store.
1. You have already installed and configured the Lexicon Discourse plugin on your Discourse site.
1. You have enabled email deep linking within the Lexicon Discourse plugin settings, and the app scheme matches what you published your app with.
1. You have at least 1 mobile device with your Lexicon-powered mobile app already installed, with the correct app scheme as it was configured in Discourse.
1. You have at least 2 separate Discourse accounts to test with.
1. Ensure your Discourse site allows **mailing list mode**, and that it is turned on for the accounts you are testing with.
   - If you do not do this, you will have to wait for Discourse to send its next digest email, which could take a while.

## Steps

To test email deep linking within your **published** Lexicon-powered mobile app, follow these steps:

1. Ensure you have access to at least 2 separate accounts on your Discourse instance.
1. On your mobile device, open your Lexicon-powered mobile app and login using one of your accounts.
   - **Note**: ensure that your email client on your mobile device will receive emails for this account.
1. Open your Discourse site in a web browser on your laptop or desktop computer.
1. Login to your **second** Discourse account in your web browser.
1. On your mobile device, using the **first** account, create a new post.
1. Now, on your laptop or desktop computer, using the **second** account, find the post you created on the mobile app and reply to it.
1. Back on your mobile device, you should receive an email notification from Discourse about the reply from the second account.
1. Click on the button that says `Visit Message` or `Visit Topic`. The label depends on what activity generated the email (see screenshot below).
1. The link will first open in your mobile web browser. Provided that the Lexicon-powered mobile app is installed and matches the configured app scheme, it should automatically open your app to the relevant topic or message scene.

<div style={{textAlign: 'center'}}>
    <img width="400"  src={useBaseUrl('/img/screenshot/Discourse-Plugin-Email-notification.png')} />
</div>

And that's it! You have successfully completed the steps to enable and test email deep linking in your app.
