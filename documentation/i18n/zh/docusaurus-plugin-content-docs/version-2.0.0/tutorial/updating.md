---
title: 更新应用
---

## EAS Update {#eas-update}

EAS Update 是 `expo publish` 的升级版本。该服务有助于使用 `expo-updates` 库更新项目。

EAS Update 使您能够在不完整的应用商店提交新应用的情况下向用户推送快速修复。

使用 EAS Update，无需重新编译应用的非本机部分，例如 TypeScript 代码、样式或图像资产。[点击这里](https://docs.expo.dev/eas-update/introduction/)了解更多关于 EAS Update 的信息。

:::note
在使用 EAS Update 之前，您需要使用 [EAS Build](building) 构建应用。
:::

### 配置 {#configuration}

让我们通过配置 EAS Update 来开始。欢迎查看 Expo 的[完整指南](https://docs.expo.dev/build-reference/build-configuration/)以获取更多详细信息。

```bash
eas update:configure
```

运行此命令将在 `app.json` 中添加 `expo.updates.url` 和 `runtimeVersion.policy`。

:::caution

如[Expo文档](https://docs.expo.dev/build/updates/#previewing-updates-in-development-builds)中所述，添加 `app.json` 中的 `runtimeVersion` 字段后，您将无法在 Expo Go 中启动应用（使用 `expo start`）。建议使用 `expo-dev-client` 代替创建开发构建。

```bash
eas -p all -e development
```

或者，如果您仍希望使用 Expo Go，请在运行 `expo start` 之前从 `app.json` 中删除 `runtimeVersion` 字段。
:::

### 更新 {#updating}

在进行必要更改后，您可以使用以下命令推送更新：

```bash
eas update –-branch <branch> –-message “<message>”
```

这里的分支名称与构建应用时的构建配置名称相同。例如，使用以下命令构建应用：

```bash
eas build –p all –e preview
```

您可以稍后使用以下命令更新：

```bash
eas update –-branch preview –-message “Fixing typos”
```

更新结束后，重启已安装的应用两次以查看更新。

## 大功告成！ 🙌 {#all-done-

这就是本教程的全部内容。干得漂亮！

希望本教程能帮助您更好地了解 Lexicon 并学会如何使用它。

如果您还有疑惑，请查看[Lexicon 文档](../)以更深入地了解项目及其工作原理。

如果您有任何问题、评论、反馈或想要提交贡献，请在 Github 上联系我们！
