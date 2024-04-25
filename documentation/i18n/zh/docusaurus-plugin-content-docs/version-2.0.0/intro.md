---
id: intro
title: 简介
slug: /
---

<head>
    --- iOS Auth
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Login.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_SignUp.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Home.png')}/>
    --- iOS Dark Mode
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_DarkMode.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_NewPost.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_PostDetail.png')}/>
    --- iOS Comment
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Comment.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Profile.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Notification.png')}/>
    --- iOS Message
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/IOS_Message.png')}/>
    --- Android Auth
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Login.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_SignUp.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Home.png')}/>
    --- Android Dark Mode
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_DarkMode.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_NewPost.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_PostDetail.png')}/>
    --- Android Comment
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Comment.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Profile.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Notifications.png')}/>
    --- Android Message
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Android_Message.png')}/>
</head>

import useBaseUrl from '@docusaurus/useBaseUrl';
import Carousel from 'react-bootstrap/Carousel';

---

Lexicon 是一款基于[Discourse](#what-is-discourse)构建的，可定制的预建移动应用程序，可以提供优雅的移动讨论体验。

## 特性 {#features}

- 主题、私信、用户注册、资料管理等功能
- 为现有 Discourse 站点快速创建 Android 和 iPhone 应用程序
- 将[推送通知](./push-notifications/introduction.md)直接发送到用户的移动设备上
- 通过[电子邮件深度链接](./email-deep-linking/intro.md)获得更无缝的原生 Discourse 体验
- 为您的品牌[定制应用程序](white-labeling)
- 由 [GraphQL](https://graphql.org/) API 提供支持
- 免费开源！
- 提供[商业支持](commercial-support)

## 优势 {#benefits}

- 启动自定义的 Discourse 移动应用
- 通过添加以移动为先的 Discourse 来优化用户的互动体验——不再需要[WebViews](https://www.kirupa.com/apps/webview.htm)。
- 使用 [React Native](https://reactnative.dev/) 和 [Expo](https://expo.io) 构建，为 iOS 和 Android 提供原生外观和体验。
- 包含一个自动文档化的[GraphQL](https://graphql.org/) [接口](concepts#prose-discourse-through-graphql)，您可以在其上构建 Discourse 应用。

## 应用展示 {#screenshots}

### iOS {#ios}

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

### Android {#android}

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

## Lexicon如何运行? {#how-does-lexicon-work}

Lexicon通过**两个关键组件**提供原生移动Discourse体验：

- [**Lexicon移动应用**](#the-lexicon-mobile-app) - 使用[Expo](https://expo.io)和[React Native](https://reactnative.dev/)构建的现代移动应用
- [**Prose**](#prose-discourse-through-graphql)，基于Discourse API 的 GraphQL API

### Lexicon移动应用 {#the-lexicon-mobile-app}

Lexicon移动应用使用[Expo](https://expo.io)构建，这使我们可以使用单个代码库维护iOS和Android应用。

对于不熟悉的人，Expo提供了在[React Native](https://reactnative.dev/)之上提供优越的开发和部署体验。

### Prose: Discourse 之上的 GraphQL {#prose-discourse-through-graphql}

Prose 是 Lexicon 构建在Discourse的API之上的[GraphQL](https://graphql.org/)层.

这使开发人员可以快速构建基于现有 Discourse 站点的应用程序，同时利用[GraphQL的优势](https://www.apollographql.com/docs/intro/benefits/)。

### 什么是Discourse? {#what-is-discourse}

Discourse是一款开源的**讨论软件**，设计简单，易于设置，维护良好。

您可以在[Discourse网站](https://www.discourse.org/)上了解更多。

### 其他细节 {#further-details}

您可以在[概念与架构](concepts)中了解我们方法的技术细节。

## 开源协议 {#license}

MIT. Copyright (c) [Lexicon](https://github.com/lexiconhq)
