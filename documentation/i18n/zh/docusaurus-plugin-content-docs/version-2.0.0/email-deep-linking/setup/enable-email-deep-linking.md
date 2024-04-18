---
title: 启用电子邮件深度链接
---

import useBaseUrl from '@docusaurus/useBaseUrl';

本指南将引导您完成在 Discourse 站点上激活电子邮件深度链接所需的步骤。

## 步骤 {#steps}

1. 确保已安装并激活[Lexicon Discourse 插件](../../discourse-plugin-installation.md)。
2. 访问您的 Discourse 管理面板。
3. 导航到 `插件` 部分。

    <img src={useBaseUrl('/img/screenshot/Discourse-Plugin-Settings.png')} />

4. 找到 `discourse-lexicon-plugin` 并单击 `设置` 按钮。
5. 在 `lexicon app scheme` 设置中填写您的应用 scheme。必须填写应用 scheme 才能启用电子邮件深度链接。
6. 在 Lexicon 设置部分中选中 `启用电子邮件深度链接` 复选框并保存更改。

    <img src={useBaseUrl('/img/screenshot/Discourse-Plugin-EmailDeepLinking-Settings.png')} />

启用电子邮件深度链接功能后，您将能够在您的 Discourse 实例中使用其功能。

具体来说，当您的用户收到新消息或帖子的电子邮件通知时，链接将被覆盖以重定向到 Lexicon Discourse 插件中的自定义端点。

如果用户在移动设备上已安装了您的 Lexicon 手机应用（根据您指定的应用 scheme），页面将尝试打开应用并重定向到相关消息或帖子。

否则，页面将回退到 Discourse Web 应用程序中的消息或帖子的默认行为。
