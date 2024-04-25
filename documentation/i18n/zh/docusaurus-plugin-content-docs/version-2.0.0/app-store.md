---
title: 发布到 iOS 应用商店
---

import useBaseUrl from '@docusaurus/useBaseUrl';

现在你应该已经对 Lexicon 移动应用做了一些小的调整，并准备好发布，以便用户可以下载。

在这个页面中，我们将介绍在 iOS 上发布的过程。

## 前提 {#prerequisites}

- 拥有 Apple 开发者账户
- 拥有 Expo 账户
- 在开发机器上安装了 XCode
- EAS CLI 2.6.0 或更新版本
- [Lexicon Discourse 插件](./discourse-plugin.md)已经安装在你的 Discourse 站点上

要开始使用 TestFlight 并发布你的应用，你需要一个 **Apple 开发者账户**。

这将使你能够在提交到 TestFlight 和最终 App Store 的过程中与 Apple 互动。

你还需要一个 [Expo 账户](https://expo.dev/signup)，这样你就可以构建你的应用、下载它并上传到 Apple 的服务器。

最后，你需要已经下载并安装了 [Xcode](https://developer.apple.com/xcode/)，这是你用来上传构建好的应用到 Apple 服务器的工具。

:::note
如果你还没有 Apple 账户，你需要先加入 [Apple 开发者计划](https://developer.apple.com/programs/enroll/)。请注意，这是需要年费的。

除此之外，你还需要确保你已经注册了一个 [Expo 账户](https://expo.dev/signup)，这样你就可以使用 [EAS Submit](https://docs.expo.dev/submit/introduction/) 等功能。
:::

## 注册一个新的 Bundle ID {#register-a-new-bundle-id}

Apple 的 App Store 中的每个应用都有一个唯一的 **Bundle Identifier**，或 Bundle ID。

为了在任何地方发布应用，包括 TestFlight，你都需要为你的应用注册一个 Bundle ID。

通常，ID是 `com.<yourcompany>.<yourappname>` 的格式。

比如说，如果你的公司名字是 Expo，你的应用名字是 Expo Go，那么你的 Bundle ID 可以是：

```
com.expo.expogo
```

你可以按照以下步骤获取一个 Bundle ID。

- 前往 [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/bundleId/add/bundle)。
- 填写以下字段，然后点击 `Continue`。
  <img alt="Regsiter App" width="900" src={useBaseUrl('/img/guides/testFlight/register-app-id.png')}/>

  - **Description**: 你可以将应用名字作为描述。
  - **Bundle ID**: 选择 `Explicit`，然后在输入框中插入你的 Bundle ID。
  - Capabilities： 可以不填写此字段。

## 在 App Store Connect 中添加一个新的应用 {#add-a-new-app-in-app-store-connect}

步骤：

- 登录你的 [App Store Connect](https://appstoreconnect.apple.com/) 账户。
- 点击 `My Apps`。
  <img alt="App Connect" width="900" src={useBaseUrl('/img/guides/testFlight/app-connect.png')}/>
- 点击 `+` 按钮添加新的应用。
- 填写关于你的应用的信息，然后点击 `Create`。
  <img alt="Add New App" width="900" src={useBaseUrl('/img/guides/testFlight/new-app.png')}/>

  - **Platforms**: 选择 `iOS`。
  - **Name**: 应用的名字，将会出现在 App Store 和用户的设备上。
  - **Primary Language**: 如果本地化的应用信息不可用，将使用的主要语言。
  - **Bundle ID**: 选择你在上面创建的 Bundle ID。
    - **注意**：一定要确认它是正确的，因为之后无法更改。
  - **SKU (Stock Keeping Unit)**: 用于区分你的应用和其他应用的唯一 ID，类似于产品 ID。
  - **User Access**: 完全访问意味着所有用户都可以访问应用，而有限访问意味着只有在 App Store Connect 中定义的某些角色才能访问应用。

## 配置 {#configuration}

在 App Store Connect 中创建应用之后，你需要回到代码库中进行一些调整。

### 构建配置 {#build-config}

:::note
如果你还没有安装 EAS CLI，请按照 [教程](tutorial/setup#install-the-eas-cli) 中的说明进行安装。
:::

首先，你需要确保在 `frontend/app.json` 中设置了你的应用名字和 slug。[slug](https://docs.expo.dev/workflow/glossary-of-terms/#slug) 用作 Expo Web 服务上应用的 URL 的一部分，建议使用 kebab-case（例如，`my-lexicon-app`）。

将这些占位符替换为你想要的值：

:::info
请注意，下面的样例也包含了 `scheme`。如果你想在你的应用中支持 [电子邮件深度链接](./email-deep-linking/intro.md)，**你必须指定一个 scheme**，然后使用相同的 scheme 配置 Lexicon Discourse 插件。
:::

```json
"name": "<your app name>",
"slug": "<your app slug>",
"scheme": "<your app scheme>",
```

接下来，在 `frontend/` 目录运行以下命令来配置 EAS Build：

```bash
eas build:configure
```

EAS CLI 会提示你指定 `android.package` 和 `ios.bundleIdentifier`，如果这些值在 `app.json` 中尚未提供的话。你需要将你刚刚在 App Store Connect 中注册的 Bundle ID 作为 `bundleIdentifier`。

然后你可以看到 `frontend/app.json` 文件的 `ios` 部分的值已经更新。

```json
   "ios": {
      "supportsTablet": false,
      "buildNumber": "1.0.0",
      "bundleIdentifier": "<your bundle ID>",
      "config": {
        "usesNonExemptEncryption" : false
      }
    },
```

:::note
此处将 `usesNonExemptEncryption` 设置为 `false`，是因为 Lexicon 不提供该功能。

更多详细信息，请查看[这个链接](https://developer.apple.com/documentation/bundleresources/information_property_list/itsappusesnonexemptencryption)。
:::

### 配置 Config 值 {#setup-config-values}

:::info
当你发布应用时，需要将 Prose 部署到一个可公开访问的地方，比如 AWS 或 DigitalOcean 这样的云托管服务商。如果 Prose 只在你的本地机器上运行，那么下载你的应用的用户将无法使用它。

如果你还没有部署 Prose，请查看[此文档](deployment)。
:::

接下来，在 `Config.ts` 中为你的构建配置 **Prose URL**。你可以为每个构建通道设置不同的 URL。

:::note
在 Lexicon 的原始版本中，**Prose URL** 是在 `frontend/.env` 中指定的。不过，作为迁移到 Expo 的 EAS 功能的一部分，我们将配置集中到了 `frontend/Config.ts` 中，以免你需要在多个地方维护它，正如[Expo 文档](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)中所建议的那样。
:::

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

### 配置 Apple 开发者账户 {#setup-apple-dveloper-account}

最后，请在 `eas.json` 中使用你的账户信息调整这些字段，以便提交应用：

```json
   "base": {
      "ios": {
        "appleId": "<your apple ID>",
        "ascAppId": "<your App Store connect ID>",
        "appleTeamId": "<your apple team ID>"
      },
      ...
   },
```

- **appleId**: 你的 apple ID (e.g., `john@gmail.com`).
- **ascAppId**: 你的 App Store Connect app ID. 跟着这份[教程](https://github.com/expo/fyi/blob/main/asc-app-id.md)可以找到你的 ascAppID (e.g., `1234567890`).
- **appleTeamId**: 你可以在[这里](https://developer.apple.com/account/) (e.g., `12LE34XI45`)查看你的 apple team ID.

## 构建iOS应用 {#build-your-app-for-ios}

在发布之前，你需要指示 Expo 生成一个 iOS 构建。

在发布之前，建议使用 `preview` 配置文件构建你的应用，以验证它是否按预期工作。查看[这个教程](tutorial/building)了解更多关于构建配置文件的信息。

运行以下命令：

```bash
eas build --platform ios --profile preview
```

当你运行上面的命令时，Expo 会提示你输入你的 Apple ID 和密码。

上述步骤完成后，请登录到你的 [Expo](https://expo.dev) 账户并下载你新构建的应用。

在[Expo web 控制台](https://expo.dev)中找到你的项目，然后点击位于屏幕左侧的 **Builds** 菜单。

- 点击你想安装的项目
  <img alt="Builds" width="900" src={useBaseUrl('/img/guides/testFlight/builds.png')}/>

- 点击 `Build Artifact` 一栏中的 `Download` 按钮下载 iOS 构建。
  <img alt="Build Artifact" width="900" src={useBaseUrl('/img/guides/testFlight/build-artifact.png')}/>

随后将下载一个包含你的应用的 tar 文件。解压文件，然后将其拖到模拟器中安装。查看[教程](tutorial/building#1-preview)中的这一部分了解如何在真实设备上运行应用。

验证应用按预期运行后，你就可以继续构建发布版本：

```bash
eas build --platform ios --profile production
```

生产构建的方法与生成预览构建的方法类似。但与预览构建不同的是，你无法在 iOS 模拟器中启动生产构建，它仅用于发布到 App Store。

构建完成后，你可以继续将其提交给 Apple。这个过程通常涉及到 Apple 的 TestFlight 服务。

## 提交到 TestFlight {#submit-to-testflight}

TestFlight 是 Apple 开发者计划的一个关键组成部分，它允许开发者在较少的审核要求下向测试用户提供应用。

通过 TestFlight，你可以邀请用户测试你的应用，并在发布到 App Store 之前收集他们的反馈。你可以在[这里](https://developer.apple.com/testflight/)了解更多关于 TestFlight 的信息。

使用 EAS Submit 提交 iOS 应用要容易得多。这在[教程](tutorial/publishing)中有更详细的介绍。

运行以下命令开始将应用发布到 TestFlight：

```bash
eas submit --platform ios --profile production
```

这个过程可能需要一些时间，因为 Apple 会对你的应用进行审核。审核成功后，我们就可以在 App Store Connect 中检查构建。

在 App Store Connect 中，点击 TestFlight 选项卡。

你会看到你构建版本的[状态](https://help.apple.com/app-store-connect/#/dev3d6869aff)。

- **红色**表示你需要执行一些操作。
- **黄色**表示流程的某些方面是待定的，你或者 Apple 的某些操作尚未完成。
- **绿色**表示构建正在 TestFlight 中测试，或者已经准备好提交审核。

在 Apple 官方测试人员验证你的应用之前，你无法开始使用 TestFlight 进行测试。

为了让 Apple 能够正确测试你的 Lexicon 应用，他们需要登录你的 Discourse 站点的凭证。

所以在提交你的应用之前，你需要在 Discourse 中创建这些凭证，并在 App Store Connect 中指定它们。

- 在 App Store Connect 中，点击你的应用。
- 点击 TestFlight 应用。
- 在左侧边栏中点击 Test Information。
- 填写必填字段，然后勾选 `Sign in required` 复选框，并输入凭证。
  <img alt="Review Information Sign In" width="900" src={useBaseUrl('/img/guides/testFlight/review-signin.png')}/>
- 请提供一个联系人的信息，以便审核团队在需要时联系。
  <img alt="Review Information Contact" width="900" src={useBaseUrl('/img/guides/testFlight/review-contact.png')}/>

### 指定 Beta 测试用户 {#specify-users-for-beta-testing}

Beta 测试用户可以属于内部组或外部组。

你可以通过转到内部组部分，然后点击 **App Store Connect Users** 来指定内部用户。

类似地，你可以通过选择外部组，然后点击 **Add External Testers** 来指定外部用户。

#### 更多信息 {#more-information}

TestFlight 和 App Store Connect 是一些复杂的工具，可以帮助你提交、测试和发布你的应用。

如果你有进一步的问题或者只是想了解更多，我们建议你使用 Apple 的文档，这些文档质量很高。

有关 TestFlight 的更多信息，请阅读[文档](https://developer.apple.com/testflight/)。

同样，关于使用 TestFlight 进行 Beta 测试的具体信息，请查看[Testing Apps with TestFlight](https://testflight.apple.com/)。

## 发布到 App Store {#publish-to-the-app-store}

一旦你成功通过了 Apple 的审核流程，并且从你的 Beta 测试人员那里收到了足够的反馈，你就可以发布到 App Store 并上线了！:tada:

此外请再次确认如下事项：

- 你的 Discourse 实例在线、可访问，并且正常运行。
- 构建版的应用已经配置为指向正确的 Prose 服务器。
- 你的 Prose 服务器在线、可访问并且正常运行。
- 你的 Prose 服务器已经按照[生产环境的推荐指南](dedicated#configure--deploy-prose)进行了部署。
  - 特别是，确保其流量是通过 SSL 证书加密的。

接下来，我们将指导你完成在 Google Play Store 上发布 Android 设备的应用的过程。
