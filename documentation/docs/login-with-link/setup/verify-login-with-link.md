---
title: Verify Login With Link
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Below, we'll walk you through how you can validate the functionality of login with a link within your Lexicon-powered mobile app.

:::note
The steps below assume that **you have already build your Lexicon-powered mobile app with the correct app scheme**. If you are running the app on your machine locally through Expo, these steps will not work.
:::

:::info
In order to be able test login with a link, **you will need to use Lexicon version 2.2.0** for your Lexicon app.
:::

## Steps

To test login with a link within your Lexicon-powered mobile app, follow these steps:

1. Ensure that you have Lexicon-powered mobile app at your device.
2. On your mobile device, open your Lexicon-powered mobile app and log in using one of your accounts.
   - **Note**: Ensure that your email client on your mobile device will receive emails for this account.
3. On the login screen, enable `send login link, skip password`. Then, enter your Discourse email account and click the `send link` button. You will receive a popup message to check your email.

<div style={{textAlign: 'center'}}>
  <img src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Mobile-LoginWithLink.png')} width="360" />
</div>
4. Open your email on your phone and check the email sent by your Discourse website.
5. Click the link provided in the email.

<div style={{display: 'flex', alignItems: 'center'}}>
  <img src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Discourse-Plugin-LoginWithLink-Email.png')} width="360" />
  <img src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Mobile-LoginWithLink-Redirect.png')} width="360" />
</div>

6. The link will first open in your mobile web browser. If the Lexicon-powered mobile app is installed and matches the configured app scheme, it should automatically log you in to your app.

And that's it! The Lexicon Discourse plugin will properly log you in with a link through your Discourse site.
