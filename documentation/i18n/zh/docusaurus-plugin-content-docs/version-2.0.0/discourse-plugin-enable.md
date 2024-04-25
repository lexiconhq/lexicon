---
title: 启用 Lexicon 插件
slug: discourse-plugin/enable
---

import useBaseUrl from '@docusaurus/useBaseUrl';

---

在你确认插件已经安装并 Discourse 实例已经重新运行后，你可以按照以下步骤启用插件：

1. 作为管理员用户，访问你的 Discourse 管理面板。
2. 导航到 `插件` 选项卡。

   你会注意到 `discourse-lexicon-plugin` 还没有启用。

   <img loading="eager" alt="插件管理页面" src={useBaseUrl('/img/screenshot/Discourse-Plugin-Settings.png')}/>

3. 点击 `discourse-lexicon-plugin` 条目旁边的 `设置` 按钮。
4. 选择你想要启用的功能并打开它。

##### 推送通知 {#push-notifications}

对于推送通知插件，你只需要勾选 `lexicon push notifications enabled` 复选框。这在[启用推送通知](./push-notifications/setup/enable-push-notifications.md)中有详细介绍。

##### 电子邮件深度链接 {#email-deep-linking}

对于电子邮件深度链接，你需要在启用之前先填写你的应用 scheme。

<img loading="eager" alt="Plugin Settings Page" src={useBaseUrl('/img/screenshot/Discourse-Plugin-EmailDeepLinking-Settings.png')}/>

这部分内容在[启用电子邮件深度链接](./email-deep-linking/setup/enable-email-deep-linking.md)中有详细介绍。
