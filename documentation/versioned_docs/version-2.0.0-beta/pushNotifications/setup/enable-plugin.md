---
title: Enable the Push Notifications
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<head>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Discourse-Plugin-Settings.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Discourse-Plugin-PushNotif-Settings.png')}/>
</head>

This guide will walk you through the necessary steps to activate push notifications through your Discourse site.

## Step-by-Step Guide: Enable Push Notifications

To enable the plugin in your Discourse admin settings, follow these steps:

1. As an admin user, access your Discourse admin dashboard..

2. Navigate to the "Plugins" section.

<img src={useBaseUrl('/img/screenshot/Discourse-Plugin-Settings.png')} />

3. Look for the "discourse-lexicon-plugin" and click on the "Settings" button.

4. Check the "Push Notifications Enabled" box in the Lexicon settings section and save your changes.

<img src={useBaseUrl('/img/screenshot/Discourse-Plugin-PushNotif-Settings.png')} />

Once the push notifications setting is enabled, your users will be able to log in through the mobile app and start receiving push notifications.

It is important to remember that push notifications are setup specifically when the user logs in through the mobile app. If users are not receiving push notifications, you should instruct them to log out and log back in before attempting any further troubleshooting.
