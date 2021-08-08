---
id: intro
title: Introduction
slug: /
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Carousel from 'react-bootstrap/Carousel';

---

Lexicon is a customizable, pre-built mobile app that provides an elegant mobile discussions experience. Built on top of [Discourse](#what-is-discourse).

## Features

- Topics, Private Messaging, User Signups, Profile Management, and more.
- Straightforward process to [**customize**](white-labeling) the app for your brand
- Rapidly build Android and iPhone apps for your existing Discourse site
- Backed by a [GraphQL](https://graphql.org/) API
- Free and open source!
- [Commercial support](commercial-support) available

## Benefits

- Launch a custom mobile discussions app
- Increase engagement with your users by adding a mobile-first Discourse experience—no more [WebViews](https://www.kirupa.com/apps/webview.htm).
- Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.io), delivering a native look-and-feel on both iOS and Android.
- Includes an auto-documented [GraphQL](https://graphql.org/) [interface](concepts#prose-discourse-through-graphql) over the Discourse API, which you can build on top of.

## Screenshots

### iOS

<Carousel>
    <Carousel.Item>
        <img alt="IOS Lexicon Login Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_Login.png')}/>
        <img alt="IOS Lexicon Signup Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_SignUp.png')}/>
        <img alt="IOS Lexicon Home Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_Home.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img alt="IOS Lexicon Dark Mode in Home Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_DarkMode.png')}/>
        <img alt="IOS Lexicon New Post Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_NewPost.png')}/>
        <img alt="IOS Lexicon Post Detail Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_PostDetail.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img alt="IOS Lexicon Comment Section" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_Comment.png')}/>
        <img alt="IOS Lexicon Profile Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_Profile.png')}/>
        <img alt="IOS Lexicon Notification Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_Notification.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img alt="IOS Lexicon Message Page" width="160" height="320" src={useBaseUrl('/img/screenshot/IOS_Message.png')}/>
    </Carousel.Item>
</Carousel>

### Android

<Carousel>
    <Carousel.Item>
        <img alt="Android Lexicon Login Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_Login.png')}/>
        <img alt="Android Lexicon Signup Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_SignUp.png')}/>
        <img alt="Android Lexicon Home Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_Home.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img alt="Android Lexicon Dark Mode in Home Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_DarkMode.png')}/>
        <img alt="Android Lexicon New Post Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_NewPost.png')}/>
        <img alt="Android Lexicon Post Detail Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_PostDetail.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img alt="Android Lexicon Comment Section" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_Comment.png')}/>
        <img alt="Android Lexicon Profile Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_Profile.png')}/>
        <img alt="Android Lexicon Notification Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_Notifications.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img alt="Android Lexicon Message Page" width="160" height="320" src={useBaseUrl('/img/screenshot/Android_Message.png')}/>
    </Carousel.Item>
</Carousel>

## How does Lexicon work?

Lexicon delivers a native mobile Discourse experience with **two key components**:

- The [**Lexicon Mobile App**](#the-lexicon-mobile-app) - a modern mobile app built with [Expo](https://expo.io) & [React Native](https://reactnative.dev/)
- [**Prose**](#prose-discourse-through-graphql), our GraphQL API on top of the Discourse API

### The Lexicon Mobile App

The Lexicon Mobile App is built with [Expo](https://expo.io), which allows us to maintain both the iOS and Android apps with a single codebase.

For those unfamiliar, Expo provides a superior development and deployment experience on top of [React Native](https://reactnative.dev/).

### Prose: Discourse through GraphQL

Prose is Lexicon's [GraphQL](https://graphql.org/) layer built on top of Discourse's API.

This enables developers to quickly build apps on top of a live Discourse instance while leveraging the [benefits of GraphQL](https://www.apollographql.com/docs/intro/benefits/).

### What is Discourse?

Discourse is open-source **discussion software** that is thoughtfully designed, simple to setup, and well-maintained.

You can learn more about it on the [Discourse website](https://www.discourse.org/).

### Further Details

You can learn about the technical details of our approach in [Concepts & Architecture](concepts).

## License

MIT. Copyright (c) [Lexicon](https://github.com/lexiconhq)
