---
title: 构建应用
---

## EAS Build {#eas-build}

EAS Build 是 `expo build` 的升级版本。该服务有助于为您的 Expo 和 React Native 项目构建应用程序二进制文件。在 Expo 文档中阅读更多关于它的内容 [这里](https://docs.expo.dev/build/introduction/)。

### 配置 {#configuration}

让我们从配置 EAS 构建开始。查看 [这里](https://docs.expo.dev/build-reference/build-configuration/) 以查看 Expo 的完整指南。

#### 构建设置 {#build-setup}

在 `/frontend` 目录中运行以下命令：

```bash
eas build:configure
```

运行该命令时，EAS CLI 通常会执行以下操作：

1. 它会提示您输入 EAS 项目 ID，要么使用现有 ID（如果您有的话），要么创建一个新的。然后它会自动在 `app.json` 中添加 `expo.extra.eas.projectId` 字段。
2. 如果 `app.json` 中没有提供 `android.package` 和 `ios.bundleIdentifier`，它会提示您指定这两个值。请注意，这两个值不必相同。
3. 如果 `eas.json` 文件不存在，它会创建一个新的。但是我们已经为您设置好了，所以您不需要担心创建一个。

您可以看到运行命令后 `app.json` 中的值已经更新。

#### 配置变量 {#configuration-values}

:::info
当你发布应用时，需要将 Prose 部署到一个可公开访问的地方，比如 AWS 或 DigitalOcean 这样的云托管服务商。如果 Prose 只在你的本地机器上运行，那么下载你的应用的用户将无法使用它。
如果你还没有部署 Prose，请查看[此文档](deployment)。

在 Lexicon 的原始版本中，**Prose URL** 是在 `frontend/.env` 中指定的。不过，作为迁移到 Expo 的 EAS 功能的一部分，我们将配置集中到了 `frontend/Config.ts` 中，以免你需要在多个地方维护它，正如[Expo 文档](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)中所建议的那样。
:::

接下来，在 `Config.ts` 中为你的构建配置 **Prose URL**。你可以为每个构建通道设置不同的 URL。你不需要调整 `localDevelopment` 中的值，因为它仅在开发时使用，而不是在构建应用时使用。

```ts
const config = {
  // ...
  buildChannels: {
    preview: {
      proseUrl: 'http://PLACEHOLDER.change.this.to.your.prose.url',
    },
    production: {
      proseUrl: 'http://PLACEHOLDER.change.this.to.your.prose.url',
    },
  },
};
```

### 运行构建 {#run-a-build}

#### 为两个平台构建 {#build-for-both-platforms}

```bash
eas build --platform all
```

```bash
eas build -p all
```

#### iOS only {#ios-only}

```bash
eas build --platform ios
```

#### Android only {#android-only}

```bash
eas build --platform android
```

#### 使用特定配置运行构建 {#run-a-build-with-a-specific-profile}

```bash
eas build --platform all –-profile <build-profile-name>
```

```bash
eas build -p all –e <build-profile-name>
```

:::note
在未指定 `--profile` 的情况下，EAS CLI 将默认使用 `production` 配置。
:::

### 构建配置文件 {#build-profiles}

构建配置文件用于在构建移动应用时为不同场景分组配置值。

你可以在 [这里](https://docs.expo.dev/build/eas-json/) 找到更多细节。

`eas.json` 文件可以包含多个构建配置文件。它通常包含 3 个配置文件：**preview**、**development** 和 **production**。

#### 1. 预览 {#1-preview}

目的：在类似生产的环境中进行内部测试应用。

在使用生产配置文件构建应用之前，建议先尝试使用预览配置文件构建。这样，您可以确保应用在准备发布之前能够正常运行。

对 Android 的构建类型是 **APK** 文件，而对 iOS 的构建类型是可以安装在模拟器上的格式。

这是因为在 `eas.json` 中指定了 `ios.simulator` 选项：

```json
    "ios": {
        "simulator": true
    },
```

如果您想在真实设备上运行预览构建，您需要拥有一个 Apple 帐户，并且该帐户必须具有 Apple Developer Enterprise Program 成员资格。然后在 `eas.json` 中添加 `ios.enterpriseProvisioning` 值：

```json
    "ios": {
        "enterpriseProvisioning": "universal"
    }
```

对于 `preview` 构建配置文件，我们已经将分发模式设置为 [internal](https://docs.expo.dev/build/internal-distribution/)。这确保了 EAS 构建提供了可共享的构建 URL，并提供了运行构建的说明。

此方法可以让我们在不提交到 App Store 或 Play Store 的情况下测试应用。

#### 2. 开发 {#2-development}

目的：使调试更容易。Expo 将自动在构建中包含开发人员工具。正如你可能已经猜到的，这种构建永远不应发布到任何应用商店。

开发构建依赖于 [expo-dev-client](https://docs.expo.dev/development/introduction/)，因此如果需要，Expo 将提示我们安装该库。

与预览构建类似，您可以添加上面提到的 iOS 选项来在模拟器或真实设备上运行它们。

#### 3. 生产 {#3-production}

目的：用于提交到 App Store 和 Play Store——作为公开发布，或作为各自生态系统中的测试的一部分。

要想使用这样的的构建，必须通过对应的应用商店进行安装。

在运行构建之后，您会看到 iOS 和 Android 版本号已自动递增。正如您可能期望的那样，这是因为 `autoIncrement` 已设置为 `true`。

需要注意的是，这种行为仅适用于 TestFlight 和内部测试，因此您需要确保在 `app.json` 中手动递增 `expo.version` 以进行公开发布。Expo 提供了更多关于这个主题的 [文档](https://docs.expo.dev/build-reference/app-versions/)。

## 构建完成！ {#the-build-is-complete}

恭喜！您现在可以与大家分享安装链接，让他们试用这个应用。

在下一节中，您将学习如何将您的应用程序[发布](publishing)到 App Store 和 Play Store！
