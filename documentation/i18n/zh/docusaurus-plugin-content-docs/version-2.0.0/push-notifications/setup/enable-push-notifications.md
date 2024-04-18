---
title: 启用通知推送
---

import useBaseUrl from '@docusaurus/useBaseUrl';

<head>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Discourse-Plugin-Settings.png')}/>
    <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Discourse-Plugin-PushNotif-Settings.png')}/>
</head>

我们将指导您完成为您的 Discourse 站点启用推送通知所需的步骤。

## 步骤 {#steps}

1. 确保已安装并激活了[Lexicon Discourse 插件](../../discourse-plugin-installation.md)。
2. 作为管理员用户，访问您的 Discourse 管理面板。
3. 导航到插件部分。

    <img src={useBaseUrl('/img/screenshot/Discourse-Plugin-Settings.png')} />

4. 点击 `discourse-lexicon-plugin` 条目的 `设置` 按钮。
5. 在 Lexicon 设置部分中选中 `启用推送通知` 复选框并保存更改。

    <img src={useBaseUrl('/img/screenshot/Discourse-Plugin-PushNotif-Settings.png')} />

启用了推送通知设置后，您的用户将能够通过移动应用程序登录并开始接收推送通知。

请注意，推送通知是在用户通过移动应用程序登录时专门设置的。如果用户没有收到推送通知，您应该指示他们退出并重新登录，然后再尝试进一步的故障排除。
