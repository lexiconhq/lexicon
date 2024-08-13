---
title: Verify Activation Account With Link
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Below, we'll walk you through how you can validate the functionality of activation account with a link within your Lexicon-powered mobile app.

:::note
The steps below assume that **you have already build your Lexicon-powered mobile app with the correct app scheme**. If you are running the app on your machine locally through Expo, these steps will not work.

In order to test account activation with a link, **you will need to use Lexicon version 2.2.0** for your Lexicon app. This feature only works if the user signs up by themselves, not through an invitation from an admin or moderator. Therefore, it is required to disable the **invite only** setting in the Discourse admin settings.

:::

:::info
To be able to test this feature, you need an email account that has not been registered in Discourse.

You also need to be able to log in as an admin on the Discourse website in case you need to approve new users. This is necessary if you have enabled the `must approve users` setting in the Discourse admin settings.

:::

## Steps

To test activation account with link within your Lexicon-powered mobile app, follow these steps:

1. Ensure that you have Lexicon-powered mobile app at your device.
2. On your mobile device, open your Lexicon-powered mobile app and sign up using new email or you can sign up from discourse website.
   > **Note**:
   >
   > - Ensure that your email client on your mobile device will receive emails for this account.
   > - If you want to sign up using mobile app disable Discourse's setting `login required`

<div className="image-container-center-multiple">
  <img src={useBaseUrl('/img/screenshot/Android_SignUp.png')} width="150"/>
  <img src={useBaseUrl('/img/screenshot/Website_SignUp.png')} width="360" />
</div>

3. After you finish sign up you will receive email to activate account.
4. Open your email on your phone and check the email sent by your Discourse website.

<div className="image-container-center">
  <img src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Discourse-Plugin-ActivationWithLink-Email.png')} width="360" />
</div>

5. Click the link provided in the email.

<div className="image-container-center">
  <img src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Mobile-ActivationWithLink-Redirect.png')} width="360" />
</div>

6. The link will first open in your mobile web browser. When you click `Open App`, if the Lexicon-powered mobile app is installed and matches the configured app scheme, it should automatically open your app and attempt to log you in.
   > **Note:** If your admin settings require user approval, the login will fail, and a popup will appear indicating that a moderator's approval is required.

And that's it! The Lexicon Discourse plugin will properly log you in with a link through your Discourse site.
