---
title: Enable Push Notifications
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<head>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/plugins/version-3.0.0/Discourse-Plugin-Settings.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/plugins/version-3.0.0/Discourse-Plugin-PushNotif-Settings.png')}/>
</head>

Below, we'll walk you through the necessary steps to activate push notifications for your Discourse site.

## Steps

1. Ensure the [Lexicon Discourse plugin](../../discourse-plugin-installation.md) is installed and activated.

1. As an admin user, access your Discourse admin dashboard.

1. Navigate to the Plugins section.

<img src={useBaseUrl('/img/screenshot/plugins/version-3.0.0/Discourse-Plugin-Settings.png')} />

4. Click on the `Settings` button for the `discourse-lexicon-plugin` entry.

5. Check the `enable Push Notifications` box in the Lexicon settings section and save your changes.

<img src={useBaseUrl('/img/screenshot/plugins/version-3.0.0/Discourse-Plugin-PushNotif-Settings.png')} />

Once the push notifications setting is enabled, your users will be able to login through the mobile app and start receiving push notifications.

It is important to remember that push notifications are setup specifically when the user logs in through the mobile app. If users are not receiving push notifications, you should instruct them to log out and log back in before attempting any further troubleshooting.
