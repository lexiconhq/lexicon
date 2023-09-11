---
title: How Push Notifications work with Lexicon
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Below, we outline the interaction between the Lexicon mobile app, Prose, and the Discourse Plugin regarding the implementation of push notifications.

## The Lexicon mobile app

The Lexicon mobile app plays a crucial role in enabling push notifications for your users. When a user logs into their account using the app, a unique token is generated using the [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) library. This token serves as a unique identifier for the user's device. The app then sends this token to the Prose GraphQL API, which makes a separate request to the Lexicon Discourse plugin. The plugin then inserts a record into your Discourse site's database—ensuring any relevant activity on Discourse triggers a push notification to the user's mobile device.

## Prose

As mentioned elsewhere in the documentation, Prose is an intermediary component that facilitates communication between the Lexicon mobile app and your Discourse site. It serves the key role of providing a GraphQL interface over Discourse, which allows the mobile app to communicate with Discourse via GraphQL.

The latest Prose API exposes a new GraphQL mutation, `pushNotifications`, to receive the unique Expo push token from the mobile app when the user logs in.

Once Prose receives the token from the app, it forwards the token to the Discourse Plugin running on your site.

## Discourse Plugin

The Lexicon Discourse Plugin provides several features. In terms of enabling push notifications, it is responsible for integrating with Expo's [push notifications service](https://docs.expo.dev/push-notifications/overview/). When the Discourse Plugin receives a push token from Prose, it saves the token in your Discourse site's database, associating it with the corresponding user.

Since the Lexicon Discourse plugin has been configured to respond to events within your Discourse site, it is able to dispatch push notifications based on your users' activity.

When a relevant event triggers the need for a push notification, such as a new message or reply, the Discourse Plugin retrieves the associated user's token from your Discourse site's database. Using this token, the plugin sends a push notification request to Expo's push notification service, triggering the delivery of the push notification to the user's device.

## Flowchart

<img alt="Build Artifact" width="900" src={useBaseUrl('/img/push-notifications/push-notifications-flowchart.svg')}/>
