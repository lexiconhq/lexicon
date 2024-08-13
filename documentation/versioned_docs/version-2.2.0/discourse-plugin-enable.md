---
title: Enable the Lexicon Plugin
slug: discourse-plugin/enable
---

import useBaseUrl from '@docusaurus/useBaseUrl';

---

After you have confirmed the plugin has been installed and your Discourse instance is running again, you can follow these steps to enable the plugin:

1. As an admin user, access your Discourse admin dashboard.

2. Navigate to the `Plugins` tab.

You'll notice that the `discourse-lexicon-plugin` is not enabled yet.

<img loading="eager" alt="Plugin Admin Page" src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Discourse-Plugin-Settings.png')}/>

3. Click on the `Settings` button for the `discourse-lexicon-plugin` entry.

4. Select the feature you want to enable and turn it on.

### Push Notifications

For push notifications, all you need to do is check the box for `lexicon push notifications enabled`. This is covered in [Enable Push Notifications](./push-notifications/setup/enable-push-notifications.md).

### Email Deep Linking

For email deep linking, you need to fill in your app scheme first before enabling it.

<img loading="eager" alt="Plugin Settings Page" src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Discourse-Plugin-EmailDeepLinking-Settings.png')}/>

This is covered in detail in [Enable Email Deep Linking](./email-deep-linking/setup/enable-email-deep-linking.md).

### Login With Link

For Login with Link, you need to fill in your app scheme first before enabling it and check the box for `Lexicon Login Link Enabled`.

This is covered in detail in [Enable Login With Link](./login-with-link/setup/enable-login-with-link.md).

### Activation Account With Link

For activation account with link, you need to fill in your app scheme first before enabling it.

<img loading="eager" alt="Plugin Settings Page" src={useBaseUrl('/img/screenshot/plugins/version-2.2.0/Discourse-Plugin-Enable-ActivationWithLink.png')}/>

This is covered in detail in [Enable Activation Account With link](./activation-with-link/setup/enable-activate-with-link.md).

##### Login With Apple

For Login with Apple, you need to fill in your app bundle ID first before enabling it and check the box for `Lexicon Apple Login Enabled`.

This is covered in detail in [Enable Login With Apple](./login-with-apple/setup/enable-login-with-apple.md).
