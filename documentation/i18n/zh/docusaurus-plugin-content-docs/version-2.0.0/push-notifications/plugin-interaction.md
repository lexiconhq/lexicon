---
title: 通知推送的原理
---

import useBaseUrl from '@docusaurus/useBaseUrl';


以下是关于通知推送在 Lexicon 移动应用程序中的实现，以及Prose 和 Discourse 插件之间的交互。

## Lexicon 移动应用 {#the-lexicon-mobile-app}

Lexicon 移动应用在为用户启用推送通知方面发挥着至关重要的作用。当用户使用应用程序登录到他们的帐户时，使用 [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) 库生成一个唯一的令牌。这个令牌作为用户设备的唯一标识符。然后，应用程序将此令牌发送到 Prose GraphQL API，后者会向 Lexicon Discourse 插件发出单独的请求。然后插件将记录插入到您的 Discourse 站点数据库中，确保 Discourse 上的任何相关活动都会触发推送通知到用户的移动设备。

## Prose {#prose}

正如文档中的其他地方所提到的，Prose 是一个中间组件，它在 Lexicon 移动应用程序和您的 Discourse 站点之间进行通信。它发挥着提供 GraphQL 接口的关键作用，允许移动应用程序通过 GraphQL 与 Discourse 进行通信。

最新的 Prose API 暴露了一个新的 GraphQL mutation，`pushNotifications`，用于在用户登录时从移动应用程序接收唯一的 Expo 推送令牌。

Prose 从应用程序接收到令牌后会将其转发给运行在您站点上的 Discourse 插件。

## Discourse 插件 {#discourse-plugin}

Lexicon Discourse 插件提供了几个功能。在启用推送通知方面，它负责与 Expo 的 [推送通知服务](https://docs.expo.dev/push-notifications/overview/) 集成。当 Discourse 插件从 Prose 接收到推送令牌时，它会将令牌保存在您的 Discourse 站点数据库中，并将其与相应的用户关联。

由于 Lexicon Discourse 插件已经配置为响应您的 Discourse 站点内的事件，因此它能够根据用户的活动发送推送通知。

当相关事件触发推送通知的需求时，例如新消息或回复时，Discourse 插件从您的 Discourse 站点数据库中检索与用户关联的令牌。使用此令牌，插件向 Expo 的推送通知服务发送推送通知请求，触发将推送通知发送到用户的设备。

## 交互流程 {#interaction-flow}

<img alt="Build Artifact" width="900" src={useBaseUrl('/img/push-notifications/push-notifications-flowchart.svg')}/>
