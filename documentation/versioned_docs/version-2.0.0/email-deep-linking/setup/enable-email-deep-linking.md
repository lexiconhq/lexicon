---
title: Enable Email Deep Linking
---

import useBaseUrl from '@docusaurus/useBaseUrl';

This guide will walk you through the necessary steps to activate email deep linking on your Discourse site.

## Steps

1. Ensure the [Lexicon Discourse plugin](../../discourse-plugin-installation.md) is installed and activated.

1. Access your Discourse admin dashboard.

1. Navigate to the `Plugins` section.

<img src={useBaseUrl('/img/screenshot/plugins/Discourse-Plugin-Settings.png')} />

4. Locate the `discourse-lexicon-plugin` and click on the `Settings` button.

5. Fill in the `lexicon app scheme` setting with your app scheme. The app scheme is required to enable email deep linking.

6. Check the `lexicon email deep linking enabled` box in the Lexicon settings section and save your changes.

<img src={useBaseUrl('/img/screenshot/plugins/Discourse-Plugin-EmailDeepLinking-Settings.png')} />

Once the email deep linking feature is enabled, you will be able to utilize its functionality in your Discourse instance.

Specifically, when your users receive email notifications for a new message or post, the link will have been overwritten to redirect to a custom endpoint within the Lexicon Discourse plugin.

If the user is on mobile and has already installed your Lexicon mobile app (according to the app scheme you specified), the page will attempt to open the app and redirect to the appropriate message or post.

Otherwise, the page will fallback to the default behavior of redirecting to the message or post within the Discourse web app.
