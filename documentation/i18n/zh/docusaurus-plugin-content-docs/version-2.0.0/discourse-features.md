---
title: Discourse 特性支持
---

下表展示了详细的 Discourse 特性及其在 **Lexicon 移动应用** 中的支持情况。

如果我们遗漏了某个特性，或者这里的任何内容看起来已经过时，请随时提交一个 Pull Request 来更新表格。

你所喜欢的特性没有被支持？[联系我们](mailto:support@kodefox.com)来探讨如何将需求变成现实。

#### 我们对特性支持的一般原则 {#our-general-approach-to-feature-support}

我们最初的重点是用户侧功能，而不是管理侧功能。

例如，用户可以为他们的主题选择话题，但管理员无法从移动应用中创建新的话题类别。

所以，大多数管理任务最好还是在桌面设备上使用 Discourse 网页应用完成。

### Lexicon 移动端特性 {#lexicon-mobile-app-features}

| 特性                                                  | 描述                                                                                                                                             | 支持状态 | 备注                                                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| 消息推送 <br/><small>Lexicon version 2</small> | 接收来自回复、提及、喜欢等操作的消息推送| ✅ 🔧 | Must have the [Lexicon Discourse Plugin](./discourse-plugin.md) installed and configured                              |
| 邮件深度链接 <br/><small>Lexicon version 2</small> | 通过 Discourse 邮件中的话题或帖子链接打开移动端 APP | ✅ 🔧 | Must have the [Lexicon Discourse Plugin](./discourse-plugin.md) installed and configured                              |
| 登陆两步验证 | 允许用户在登陆时可选地使用两步验证 | ✅ | Managing 2FA, such as enabling it or disabling it from within the app, is not currently supported                     |
| 为话题添加标签 | 创建并为话题添加 tag 以提供相关信息 | ✅ 🔧 | Configuration required: see [Optimal Experience](optimal#enable-topic-tagging)                                        |
| 话题摘要 | 在主页展示话题中第一个帖子的摘要 | ✅ 🔧 | Configuration required: see [Optimal Experience](optimal#enable-topic-excerpts)                                       |
| 查看用户活动 | 查看用户的最近活动，例如最近发帖或点赞 | ✅ | The ability to filter by activity is not currently supported                                                          |
| 话题互动 | 喜欢，查看，回复，最常回复者 | ✅ |                                                                                                                       |
| 话题和帖子操作 | 点赞或修改话题或帖子 | ✅ |                                                                                                                       |
| 查看置顶或最新话题 | 提供一个可切换的开关在主页顶部显示最新发帖或最火发帖 | ✅ |                                                                                                                       |
| 搜索 | 在当前 Discourse 站点上搜索关键词，分类或者标签 | ✅ |                                                                                                                       |
| 分类目录 | 查看话题的分类目录，并根据勾选的分类筛选帖子 | ✅ | Categories cannot be created, updated, or deleted                                                                     |
| 向帖子中添加媒体素材或附件 | 用户可以在发帖时添加一些本地的媒体素材，图片或视频等 | ✅ 🔧 | Configuration recommended for supported file extensions-see [Optimal Experience](optimal#configure-upload-extensions) |
| 标准 Markdown 支持 | 在移动端 APP 发帖时，可以使用标准 Markdown 并正常渲染 | ✅ | Light, incomplete support exists for some of Discourse's custom markup, such as dates                                 |
| 注册 | 允许用户直接在移动端 APP 上注册新账户。能否注册同时也受到你的站点本身是否允许注册影响 | ✅ |                                                                                                                       |
| 访问公开站点 | 用户可以直接在移动 APP 上访问你的公开 Discourse 站点 | ✅ | Users will be prompted to login upon attempting an authenticated action                                               |
| 用户信息 | 可以查看他人的个人资料或修改自己的个人资料 | ✅ | Partial support: displays the user's photo, username, Markdown bio on a single line, and recent activity              |
| 举报帖子 | 用户可以举报发帖存在异常，管理员将会审核被举报的内容 | ✅ | Admins are not able to review posts in the app, though they will see in-app notifications for flags                   |
| 应用内通知 | 用户可以在应用内的个人资料处查看最新的消息通知，并可以将所有信息标为已读 | ✅ | Some notifications from Discourse are not tappable in the mobile app, such as badge notifications                     |
| 私人消息 | 用户可以向他人或群组发送私信 | ✅ |                                                                                                                       |
| 提及他人 | 用户可以在发帖或发私信时提及(@)他人 | ✅ |
| 主题色彩 | Provides light and dark mode support for users | ✅        | Specify color scheme (light mode, dark mode, or system) from within the app (only local to the user's mobile device)  |
| 消息红点 | The ability to see and interact with badges that have been awarded to users on the Discourse instance | ❌        |                                                                                                                       |
| 发帖草稿 | Enable users to start composing a draft of a post and return to it later                                                                                | ❌        |                                                                                                                       |
| 群组 | Enable users to create and participate in private groups of which only group members can view certain topics                                            | ❌        |                                                                                                                       |
| 管理员功能 | Discourse admin features generally not available in Lexicon—better suited to a desktop environment                                                      | ❌        | Editing posts is supported                                                                                            |
| 发帖引用, 投票, 切换开关，任务列表 | Custom text formatting that enables Discourse-specific features                                                                                         | ❌        |                                                                                                                       |
| Discourse 表情 | Utilize emojis when creating a topic, making a post, or sending a reply                                                                                 | ❌        | Standard unicode-based emojis are supported                                                                           |
| 收藏/添加书签 | Allow users to bookmark certain posts or topics                                                                                                         | ❌        |                                                                                                                       |
| DiscourseConnect (SSO) | Replace Discourse authentication with a Custom Provider                                                                                                 | ❌        |                                                                                                                       |
| Custom Authentication Plugins | Login via OAuth2 or other protocols using custom Discourse Plugins                                                                                      | ❌        |                                                                                                                       |
| 在线聊天 | Enable users to initiate conversations using the chat feature, either in a channel or through private messaging                                         | ❌        |                                                                                                                       |
| 用户消息状态 | Allow other user in community to see user message status                                                                                                | ❌        |                                                                                                                       |
