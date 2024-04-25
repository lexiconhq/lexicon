---
title: 安装插件
slug: discourse-plugin/setup
---

在你开始使用 Lexicon Discourse 插件之前，你需要完成一些先决条件和安装步骤。本文档将指导你完成这些步骤，确保插件在你的站点上顺利设置。

## 先决条件 {#prerequisites}

为了使用这个插件，你必须能够访问你的 Discourse 服务器，以一种允许你修改服务器的 `app.yml` 的方式。如果有一个托管提供商为你管理 Discourse。你需要联系他们帮你安装插件。

具体来说，你需要安装插件的能力，这意味着直接修改 `/var/discourse/containers/app.yml` 来添加 [Lexicon Discourse 插件](https://github.com/lexiconhq/discourse-lexicon-plugin.git), 修改之后你需要重新构建 Discourse 站点.

## 插件安装步骤 {#plugin-installation-steps}

### 访问你的服务器 {#access-your-server}

通过 SSH 登录到你的 Discourse 主机服务器。

不同的设备登陆方式不一样，但通常你需要使用终端应用程序，如 macOS 上的 Terminal 或 Windows 上的 PuTTY。

### 打开 Discourse `app.yml` 文件 {#open-the-discourse-appyml-file}

使用你喜欢的终端编辑器（vim、emacs、nano 等）打开 `app.yml` 文件。

:::note
你可能需要 `sudo` 权限来编辑文件，但这取决于服务器的配置。
:::

```bash
vim /var/discourse/containers/app.yml
```

### 获取插件的 Git Clone URL {#get-the-plugins-git-clone-url}

Discourse 插件通过可访问的 Git Clone URL 引用，通常以 `.git` 结尾。

[Lexicon Discourse 插件](https://github.com/lexiconhq/discourse-lexicon-plugin)的 Git Clone URL 如下：

```
https://github.com/lexiconhq/discourse-lexicon-plugin.git
```

将其复制到剪贴板，以便在下一步中使用。

### 将插件的仓库 URL 添加到你的容器的 `app.yml` 文件中： {#add-the-plugins-repository-url-to-your-containers-appyml-file}

将插件的 Git Clone URL 添加到如下的部分。

```
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://github.com/lexiconhq/discourse-lexicon-plugin.git
```

### 重新构建容器，谨慎操作 {#rebuild-the-container-with-caution}

:::caution
请注意，重新构建你的站点将导致你的站点在一段时间内下线，通常在 5 到 30 分钟之间。我们建议谨慎操作，并采取下面列出的预防措施。
:::

#### 预防措施 {#precautionary-measures}

1. 在安装插件或执行任何站点重建之前，强烈建议创建 Discourse 站点的备份。
2. 在尝试安装此插件之前，建议将 Discourse 安装和所有现有插件升级到最新版本。
3. 尽管很少见，但可能会出现站点在重建过程后无法上线的情况，需要进一步排查才能恢复。
   - 安装插件或执行任何需要重建应用的任务总会存在风险。
   - 我们建议您在最小化受影响用户的时间进行这些更改，并在出现问题时有一个明确的应急计划。

#### 运行重建命令 {#run-rebuild-command}

```bash
cd /var/discourse
./launcher rebuild app
```

### 如何卸载插件 {#how-to-uninstall-the-plugin}

要删除插件，只需从你的 `app.yml` 文件中删除 Git 克隆 URL 行，并重新构建你的站点。请记住，重新构建你的站点将导致你的站点在一段时间内下线，并伴随着一些风险。
