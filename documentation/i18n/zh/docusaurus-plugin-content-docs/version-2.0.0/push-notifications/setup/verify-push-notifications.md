---
title: 验证通知推送
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<head>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Mobile-PushNotification.png')}/>
</head>

我们将指导您如何验证 Lexicon 手机应用中的推送通知功能。

:::info
为了正确测试推送通知，**您需要在您的 Discourse 站点上拥有两个不同的账户**（以生成通知）。

此外，**您需要至少一个移动设备**用于测试。
:::

## 步骤 {#step}

为了在 Lexicon 手机应用中测试推送通知，请按照以下步骤操作：

1. 确保您已完成 Lexicon 的[入门](../../quick-start)步骤。
2. 通过在终端中导航到 `frontend/` 并运行 `yarn start` 来启动 Lexicon Expo 应用程序。
3. 使用 Expo 链接或二维码，在真实移动设备上启动应用程序。
4. 使用您的账户登录应用程序。
5. 使用该账户在您的 Discourse 站点上创建一个帖子。
6. 使用另一个账户回复帖子，以触发第一个账户的通知。
7. 您应该在手机上收到一条推送通知，其中包含另一个账户的回复内容。

<img src={useBaseUrl('/img/screenshot/Mobile-PushNotification.png')} width="360" />

如果您收到了推送通知，恭喜！您已成功验证了 Lexicon 手机应用中的推送通知功能。
