---
title: 验证电子邮件深度链接
slug: verify-email-deep-linking
---

import useBaseUrl from '@docusaurus/useBaseUrl';

:::note
以下步骤假定**您已经发布了 Lexicon 手机应用**到 App Store 和/或 Google Play Store**并且具有正确的应用 scheme**。如果您在本地通过 Expo 在您的设备上运行应用程序，这些步骤将无法能够正常工作。
:::

本指南将提供逐步说明，以帮助您验证 Lexicon 手机应用中的电子邮件深度链接功能。

## 前提条件 {#pre-requisites}

:::note
如果您尚未满足以下所有先决条件，则此测试将无法按预期工作。
:::

为了正确测试电子邮件深度链接：

1. 您**必须**已经将 Lexicon 手机应用发布到 App Store 和/或 Google Play Store。
2. 您已经安装并配置了 Lexicon Discourse 插件在您的 Discourse 站点上。
3. 您已经在 Lexicon Discourse 插件设置中启用了电子邮件深度链接，并且应用 scheme 与您发布的应用程序匹配。
4. 您至少有 1 部已经安装了您的 Lexicon 手机应用的移动设备，并且具有与 Discourse 中配置的正确应用 scheme。
5. 您至少有 2 个不同的 Discourse 帐户进行测试。
6. 确保您的 Discourse 站点允许**邮件列表模式**，并且已为您要测试的帐户打开。
   - 如果您没有这样做，您将需要等待 Discourse 发送其下一个摘要电子邮件，这可能需要一段时间。

## 步骤 {#steps}

为了在您的**已发布** Lexicon 手机应用中测试电子邮件深度链接，请按照以下步骤操作：

1. 确保您在您的 Discourse 实例上至少有 2 个不同的帐户。
2. 在您的移动设备上，打开您的 Lexicon 手机应用并使用其中一个帐户登录。
   - 我们将这个帐户称为**第一个**帐户。
   - **注意**：确保您的移动设备上的电子邮件客户端将为此帐户接收电子邮件。
3. 在您的笔记本电脑或台式电脑上的 Web 浏览器中打开您的 Discourse 站点。
4. 使用您的**第二个** Discourse 帐户登录到您的 Web 浏览器。
5. 在您的移动设备上，使用**第一个**帐户创建一个新帖子。
6. 现在，在您的笔记本电脑或台式电脑上，使用**第二个**帐户找到您在移动应用程序中创建的帖子并回复。
7. 回到您的移动设备，您应该会收到来自 Discourse 的关于第二个帐户回复的电子邮件通知。
8. 点击 `Visit Message` 或 `Visit Topic` 按钮。
   - 标签取决于生成电子邮件的活动（请参见下面的屏幕截图）。
9. 链接将首先在您的移动 Web 浏览器中打开。只要 Lexicon 手机应用已安装并匹配配置的应用 scheme，它应该会自动打开您的应用程序到相关主题或消息场景。

<div style={{textAlign: 'center'}}>
    <img width="400"  src={useBaseUrl('/img/screenshot/Discourse-Plugin-Email-notification.png')} />
</div>

如果您的 Lexicon 手机应用成功打开并重定向到相关主题或消息，恭喜！您已成功验证了 Lexicon 手机应用中的电子邮件深度链接功能。
