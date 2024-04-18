---
title: 发布到谷歌应用商店
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## 前提 {#prerequisites}

:::note
如果你还没有 Google 开发者账户，需要注意的是，创建一个账户是需要付费的。
:::

- 拥有[Google 开发者账户](https://play.google.com/console/signup) 用于访问 [Google Play 控制台](https://play.google.com/console)
- 拥有 Expo 账户
- EAS CLI 2.6.0 或更新版本
- [Lexicon Discourse 插件](./discourse-plugin.md)已经安装在你的 Discourse 站点上

## Google Play Console {#google-play-console}

[Google Play 控制台](https://play.google.com/console)允许你设置你的应用、邀请测试人员，并将你的应用发布到[Google Play 商店](https://play.google.com/store)。

由于你正在发布一个使用 Expo 构建的应用，**非常重要**的是，你要按照[Expo的说明](https://github.com/expo/fyi/blob/master/first-android-submission.md) 正确提交应用到 Google Play 商店。

## 配置应用 {#app-configuration}

在 Google Play 控制台中设置应用之后，还有一些其他的调整需要做。

### 构建配置 {#build-config}

与[发布到 App Store](app-store)的方法类似，如果你还没有设置应用名称和 slug，你需要在 `frontend/app.json` 中设置。[slug](https://docs.expo.dev/workflow/glossary-of-terms/#slug) 用作 Expo 网络服务中应用的 URL 的一部分，建议使用 kebab-case（例如，`my-lexicon-app`）。

:::info
请注意，下面的样例也包含了 `scheme`。如果你想在你的应用中支持 [电子邮件深度链接](./email-deep-linking/intro.md)，**你必须指定一个 scheme**，然后使用相同的 scheme 配置 Lexicon Discourse 插件
:::

```json
"name": "<your app name>",
"slug": "<your app slug>",
"scheme": "<your app scheme>",
```

然后，在 `frontend/` 目录运行以下命令来配置 EAS Build，或者跳到下一步：

```bash
eas build:configure
```

EAS CLI 会提示你指定 `android.package` 和 `ios.bundleIdentifier`，如果这些值在 `app.json` 中尚未提供的话。

接下来，验证 `app.json` 中的 `android` 部分是否包含了你的应用的 `package` 名称和其他特定于你的应用的细节。请注意，当你使用 `production` 配置构建应用时，`versionCode` 将会自动更新，所以你不需要手动递增版本号。

此外，根据你的应用权限，你可能需要添加更多的细节。

在下面的示例中，我们为我们的应用提供了读写外部存储的权限。

```json
    "android": {
      "package": "<your package name>",
      "permissions": [ "READ_EXTERNAL_STORAGE" , "WRITE_EXTERNAL_STORAGE"  ],
      "versionCode": 1,
    },
```

如果你的应用需要更多的权限，请确保在配置中按需指定。

如果你还不太了解权限是如何工作的，最好查看[Expo文档](https://docs.expo.io/versions/latest/sdk/permissions)上关于这个主题的内容，以便全面了解。

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

### 添加 Play Store 秘钥文件 {#add-the-play-store-secret-file}

在最后一步，你需要提供一个包含私钥的 `.json` 文件，以便与 Play Store 交互。按照[这个指南](https://github.com/expo/fyi/blob/main/creating-google-service-account.md)生成密钥。然后，将 JSON 文件复制到你的 `lexicon/frontend` 目录，并将文件重命名为 `playstore_secret.json`。

JSON 文件看起来像这样：

```json
{
  "type": "service_account",
  "project_id": "<your project ID>",
  "private_key_id": "<your private key ID>",
  "private_key": "-----BEGIN PRIVATE KEY-----<your private key>-----END PRIVATE KEY-----\n",
  "client_email": "<your client email>",
  "client_id": "<your client ID>",
  "auth_uri": "<your auth URI>",
  "token_uri": "<your token URI>",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/lexicon%40api.iam.gserviceaccount.com"
}
```

## 构建安卓应用 {#build-your-app}

因为我们使用的是 Expo 和 React Native，所以这一步与为 iOS 构建应用并没有太大的不同。

从 `frontend/` 目录运行以下命令，以在发布之前检查应用：

```bash
eas build --platform android --profile preview
```

运行 `eas build` 命令时，使用 `preview` 配置文件将会构建 APK 文件。这样你就可以快速将它加载到你的 Android 设备或模拟器上。构建完成后，转到 [Expo 网页控制台](https://expo.dev) 中的项目，然后点击屏幕左侧的 **Builds** 菜单。

- 点击你想要安装的项目。

  <img alt="Builds" width="900" src={useBaseUrl('/img/guides/playStore/builds.png')}/>

- 在 `Build Artifact` 部分按下 `Install` 按钮下载应用。

  <img alt="Build Artifact" width="900" src={useBaseUrl('/img/guides/playStore/build-artifact.png')}/>

你可以下载并在真实设备上运行应用，或者将下载的 APK 文件拖到模拟器上运行。

验证应用按预期运行后，就可以继续构建发布版本：

```bash
eas build --platform android --profile production
```

生成生产版本的步骤与生成预览版本的步骤类似。不过，与预览版本不同的是，你无法在 Android 模拟器中启动生产版本，它仅用于发布到 Play Store。

构建完成之后，你可以继续提交到 Play Store。

## 发布到 Play Store {#publish-to-the-play-store}

在这一步，你可以将应用发布到 Google Play 商店，或者在 Google Play 控制台上进行内部测试。

要进行内部测试，请运行以下命令：

```bash
eas submit --platform android --profile staging
```

要公开发布你的应用，请运行以下命令：

```bash
eas submit --platform android --profile production
```

更多关于构建配置文件的信息，请查看[这里](tutorial/publishing)。

恭喜你，到现在你已经完成了所有的步骤，你的移动应用现在已经上线，可以被用户下载了。
