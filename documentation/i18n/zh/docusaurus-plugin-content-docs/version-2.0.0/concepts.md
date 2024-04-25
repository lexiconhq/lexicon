---
title: 概念和架构
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Prose: Discourse 的 GraphQL 接口： {#prose-discourse-through-graphql}

值得一提的是，Discourse已经为开发者提供了一个传统的RESTful API。

但是[官方文档](https://docs.discourse.org/)指出，这个 API 仅仅作为开发的落脚点使用，尚不完整。

> 注意：对于未列出的任何 API 入口，您可以按照 Discourse API 逆向工程指南来找出如何使用它 。
>
> ——**Discourse API 文档**

Discourse 核心团队以及[社区](https://meta.discourse.org)的成员经常通过[鼓励开发者逆向工程API](https://meta.discourse.org/t/how-to-reverse-engineer-the-discourse-api/20576)来解答有关API的问题。截至本文撰写时，关于如何对 API 逆向工程的主题已经链接到了支持论坛上的近200个其他主题。

为了帮助您简化这个过程，Prose努力规范了API的一个子集，希冀在您开发 Discourse 时可以节省一些时间。

### GraphiQL {#graphiql}

Prose 的 GraphQL 实现包括一个[浏览器内的GraphQL IDE](https://www.graphql-yoga.com/docs/features/graphiql)，称为[GraphiQL](https://github.com/graphql/graphiql)，它允许开发者轻松地参考整个文档和模式，并对正在运行的Discourse实例进行查询。

<img alt="" width="900" src={useBaseUrl('/img/screenshot/playground.png')}/>

这意味着您可以快速了解一个方法的行为方式以及它需要哪些参数，而无需查阅支持帖子或逆向 REST API。

### 为什么选择GraphiQL？ {#why-graphiql}

关于 GraphQL 的[优势](https://www.howtographql.com/basics/1-graphql-is-the-better-rest)和[权衡](https://lwhorton.github.io/2019/08/24/graphql-tradeoffs.html)的文章不胜枚举。

我们很清楚，GraphQL 并不是解决其他 API 范例所有问题的神奇解决方案。

尽管如此，我们选择使用 GraphQL 构建 Lexicon 有两个主要原因。

1. 我们的团队熟悉并精通 GraphQL，并且非常喜欢使用它。

2. 工具、库和自动生成的文档提供了开箱即用的特性，我们可以毫不费力地将这些特性传递给其他人。

## 为什么选择 Expo？ {#why-expo}

[Expo](https://docs.expo.io/)既是一个框架，也是一个用于构建通用 React 应用程序的平台。特别是，在使用 React Native 构建移动应用程序时，它提供了卓越的开发体验。

我们发现，Expo 使我们作为开发者更加高效，并且还提供了出色的服务，以便简化构建和发布 React Native 应用程序的整个过程。

特别是，使用[Lexicon Discourse Plugin](./discourse-plugin.md)的 Discourse 站点可以通过 Expo 的[推送通知服务](https://docs.expo.dev/push-notifications/overview/)获得[推送通知](./push-notifications)，该服务将 Google 和 Apple 的推送服务抽象为一个简单的接口。

## Lexicon 架构 {#lexicon-architecture}

Lexicon Stack 相当简单，只包含3个主要部分：

- Lexicon 移动应用程序
- Prose GraphQL API
- 运行中的、可访问的Discourse实例
  - 可选地，您可以安装我们的[Discourse Plugin](./discourse-plugin.md)以启用其他功能。

下面是一个说明Lexicon移动应用程序的典型架构的图示。

<img alt="IOS Lexicon 登录页面" style={{borderRadius: '25px'}} src={useBaseUrl('/img/lexicon-architecture.svg')}/>

如上所示，移动应用程序向部署的 Prose GraphQL 服务器发出请求。

Prose 服务器已配置为指向开发者选择的可用 Discourse 实例。

如果安装了[Lexicon Discourse Plugin](./discourse-plugin.md)，将会暴露额外的接口，Prose已经知道如何与之通信。

然后，数据从 Discourse 流经 Prose，并通过 GraphQL 接口返回到移动应用程序。
