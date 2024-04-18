---
title: 优化
---

如果你打算使用 Lexicon 移动应用，你需要对 Discourse 站点进行一些调整，以为用户提供最佳的应用体验。

## 安装 Lexicon Discourse 插件 {#install-the-lexicon-discourse-plugin}

Lexicon Discourse 插件通过两种关键方式增强了用户的原生移动体验：

- 添加了对推送通知的支持
- 添加了对电子邮件深度链接的支持。

你可以在[这里](./discourse-plugin.md)阅读有关插件的更多信息以及如何设置它。

## 启用主题摘要 {#enable-topic-excerpts}

我们设计了移动应用，以便用户在滚动主题列表时可以轻松地看到主题的前几句话。

然而，默认情况下，Discourse 在列出主题时不会返回摘要。

还好有一个秘密设置可以启用这个功能。

只需要一点额外的配置就可以启用。

因为 Discourse 允许用户选择是否启用这个功能作为一个[主题组件](https://meta.discourse.org/t/topic-list-excerpts-theme-component/151520)，我们想引导你通过切换设置中的选项。

如果你更喜欢使用上面的主题组件来启用它，你也可以这样做。

要想打开这个设置需要能够访问服务器并更改其中的设置。

### 说明 {#instructions}

原版的说明可以在[这里](https://meta.discourse.org/t/discourse-as-a-simple-personal-blog-engine/138244/4)找到。

首先，进入服务器，并进入正在运行的 Discourse 应用。

```sh
$ /var/discourse/launcher enter app
```

接下来进入 Rails CLI:

```sh
$ rails c
```

最后将这个设置改成 `true`:

```sh
$ SiteSetting.always_include_topic_excerpts = true
```

操作完成之后就可以退出了，现在应用中应该可以看到摘要了。

## 启用主题标签 {#enable-topic-tagging}

Lexicon 移动应用设计时考虑到了标签的使用。

这使用户可以查看和管理主题上的标签，这是许多 Discourse 服务器上的热门功能。

不幸的是，默认情况下这个功能是关闭的。

### 说明 {#instructions-1}

为了启用它，你可以采取以下步骤：

- 导航到 `/admin/site_settings` 页面
- 使用搜索栏搜索 `tagging enabled` 设置
- 确保它被选中
- 如果你做了更改，点击绿色的复选框按钮来应用它

现在应该可以给主题加标签了，并且可以在应用中查看。

## 配置可上传文件限制 {#configure-upload-extensions}

Discourse 提供了一个安全功能，允许 Discourse 管理员指定他们的用户可以上传的文件扩展名白名单。
例如，大多数管理员会选择限制上传 `.exe` 文件。
为了与你的 Discourse 实例的设置兼容，Lexicon 移动应用简单地请求允许的文件的扩展名列表，并使用它来在应用中强制执行通过扩展名筛选文件。
默认情况下，大多数 Discourse 实例支持这个默认的扩展名列表：

- `.jpg`
- `.jpeg`
- `.png`
- `.gif`
- `.heic`
- `.heif`

如果你想调整 Discourse 站点中的文件扩展名列表，你可以按照以下说明进行操作。

### 调整 Discourse 中允许的文件扩展名 {#adjusting-allowed-extensions-in-discourse}

- 导航到 `/admin/site_settings` 页面
- 使用搜索栏搜索 `extensions` 设置
- 找到标记为 `authorized extensions` 的设置
- 根据需要调整列表，包括你希望用户能够上传的文件扩展名
- 当你完成更改后，点击绿色的复选框按钮来应用它们
- Lexicon 移动应用将从你的站点设置中接收到更新的扩展名列表，并开始为你的用户强制执行它。
