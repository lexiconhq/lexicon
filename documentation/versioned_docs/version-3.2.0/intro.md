---
id: intro
title: Introduction
slug: /
---

<head>
    <!-- --- iOS Auth -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Login.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_SignUp.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Home.png')}/>
    <!-- --- iOS Dark Mode -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_DarkMode.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_NewPost.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_PostDetail.png')}/>
    <!-- --- iOS Comment -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Comment.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Profile.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Notification.png')}/>
    <!-- --- iOS Message -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Message.png')}/>
    <!-- --- Android Auth -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Login.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_SignUp.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Home.png')}/>
    <!-- --- Android Dark Mode -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_DarkMode.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_NewPost.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_PostDetail.png')}/>
    <!-- --- Android Comment -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Comment.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Profile.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Notifications.png')}/>
    <!-- --- Android Message -->
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Message.png')}/>
</head>

import useBaseUrl from '@docusaurus/useBaseUrl';
import Carousel from 'react-bootstrap/Carousel';

---

Lexicon is a customizable, pre-built mobile app that provides an elegant mobile discussions experience. Built on top of [Discourse](#what-is-discourse).

## Features

- Topics, Private Messaging, User Signups, Profile Management, and more
- Rapidly build Android and iPhone apps for your existing Discourse site
- [Push Notifications](./push-notifications/introduction.md) direct to your users' mobile devices
- More seamless native Discourse experience [with Email Deep Linking](./email-deep-linking/intro.md)
- Straightforward process to [**customize**](white-labeling) the app for your brand
- Backed by a [GraphQL](https://graphql.org/) API
- Free and open source!
- [Commercial support](commercial-support) available

## Benefits

- Launch a custom mobile discussions app
- Increase engagement with your users by adding a mobile-first Discourse experience—no more [WebViews](https://www.kirupa.com/apps/webview.htm).
- Built with [React Native](https://reactnative.dev/) and [Expo](https://expo.io), delivering a native look-and-feel on both iOS and Android.
- Includes an auto-documented [GraphQL](https://graphql.org/) [interface](concepts#architecture-of-the-lexicon-stack) over the Discourse API, which you can build on top of.

## Screenshots

### iOS

<Carousel prevLabel="" nextLabel="" indicators={false}>
    <Carousel.Item>
        <img loading="eager" alt="IOS Lexicon Login Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_Login.png')}/>
        <img loading="eager" alt="IOS Lexicon Signup Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_SignUp.png')}/>
        <img loading="eager" alt="IOS Lexicon Home Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_Home.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img loading="eager" alt="IOS Lexicon Dark Mode in Home Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_DarkMode.png')}/>
        <img loading="eager" alt="IOS Lexicon New Post Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_NewPost.png')}/>
        <img loading="eager" alt="IOS Lexicon Post Detail Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_PostDetail.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img loading="eager" alt="IOS Lexicon Comment Section" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_Comment.png')}/>
        <img loading="eager" alt="IOS Lexicon Profile Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_Profile.png')}/>
        <img loading="eager" alt="IOS Lexicon Notification Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_Notification.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img loading="eager" alt="IOS Lexicon Message Page" className="carousel-image" src={useBaseUrl('/img/screenshot/IOS_Message.png')}/>
    </Carousel.Item>
</Carousel>

### Android

<Carousel prevLabel="" nextLabel="" indicators={false}>
    <Carousel.Item>
        <img loading="eager" alt="Android Lexicon Login Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_Login.png')}/>
        <img loading="eager" alt="Android Lexicon Signup Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_SignUp.png')}/>
        <img loading="eager" alt="Android Lexicon Home Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_Home.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img loading="eager" alt="Android Lexicon Dark Mode in Home Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_DarkMode.png')}/>
        <img loading="eager" alt="Android Lexicon New Post Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_NewPost.png')}/>
        <img loading="eager" alt="Android Lexicon Post Detail Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_PostDetail.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img loading="eager" alt="Android Lexicon Comment Section" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_Comment.png')}/>
        <img loading="eager" alt="Android Lexicon Profile Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_Profile.png')}/>
        <img loading="eager" alt="Android Lexicon Notification Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_Notifications.png')}/>
    </Carousel.Item>
    <Carousel.Item>
        <img loading="eager" alt="Android Lexicon Message Page" className="carousel-image" src={useBaseUrl('/img/screenshot/Android_Message.png')}/>
    </Carousel.Item>
</Carousel>

## How does Lexicon work?

Lexicon delivers a native mobile Discourse experience with **two key components**:

- The [**Lexicon Mobile App**](#the-lexicon-mobile-app) - a modern mobile app built with [Expo](https://expo.io) & [React Native](https://reactnative.dev/)
- The [**GraphQL API**](#graphql-api) that runs within the app to retrieve data using the Discourse API.

### The Lexicon Mobile App

The Lexicon Mobile App is built with [Expo](https://expo.io), which allows us to maintain both the iOS and Android apps with a single codebase.

For those unfamiliar, Expo provides a superior development and deployment experience on top of [React Native](https://reactnative.dev/).

### GraphQL API

To retrieve data from Discourse's REST API, we convert it into GraphQL data within Lexicon. This process is facilitated by using [apollo-link-rest](https://www.apollographql.com/docs/react/api/link/apollo-link-rest), which allows us to seamlessly map the REST endpoints to GraphQL queries without requiring a separate backend to handle the conversion.

This enables developers to quickly build apps on top of a live Discourse instance while leveraging the [benefits of GraphQL](https://www.apollographql.com/docs/intro/benefits/).

### What is Discourse?

Discourse is open-source **discussion software** that is thoughtfully designed, simple to setup, and well-maintained.

You can learn more about it on the [Discourse website](https://www.discourse.org/).

### Further Details

You can learn about the technical details of our approach in [Concepts & Architecture](concepts).

## License

MIT. Copyright (c) [Lexicon](https://github.com/lexiconhq)
