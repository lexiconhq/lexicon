---
title: Introduction
slug: discourse-plugin/
---

import useBaseUrl from '@docusaurus/useBaseUrl';

---

As of Lexicon version 2.0.0, a custom Discourse plugin is available to provide a more seamless mobile integration between Discourse and your Lexicon-powered mobile app.

The plugin offers two key features for version 2.0.0:

- **Push notifications**: support for native push notifications on user's mobile devices, according to relevant activity on your Discourse site. Powered by Expo's [push notifications service](https://docs.expo.dev/push-notifications/overview/).
- **Email deep linking**: custom deep links in emails from Discourse, allowing users to seamlessly launch your Lexicon-powered mobile app directly from their mobile email client.

As of Lexicon version 3.0.0, we have removed the features introduced in version 2.2.0 of the Discourse Lexicon plugin, which include:

- **Sign in with Apple**
- **Login with Link**
- **Activation with Link**

This change was necessitated by updates to the Discourse login flow when using webviews and the introduction of tokens through **User API Key**. These changes limit our ability to control the login process and require additional configuration to ensure proper functionality.

We are actively working on reintroducing these features in a future release
