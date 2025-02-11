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

<img loading="eager" alt="Plugin Admin Page" src={useBaseUrl('/img/screenshot/plugins/version-3.0.0/Discourse-Plugin-Settings.png')}/>

3. Click on the `Settings` button for the `discourse-lexicon-plugin` entry.

4. Select the feature you want to enable and turn it on.

### Push Notifications

For push notifications, all you need to do is check the box for `lexicon push notifications enabled`. This is covered in [Enable Push Notifications](./push-notifications/setup/enable-push-notifications.md).

### Email Deep Linking

For email deep linking, you need to fill in your app scheme first before enabling it.

<img loading="eager" alt="Plugin Settings Page" src={useBaseUrl('/img/screenshot/plugins/version-3.0.0/Discourse-Plugin-EmailDeepLinking-Settings.png')}/>

This is covered in detail in [Enable Email Deep Linking](./email-deep-linking/setup/enable-email-deep-linking.md).
