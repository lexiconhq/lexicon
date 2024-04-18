---
title: 开发配置
---

### 克隆 Lexicon 仓库 {#clone-the-lexicon-repository}

若尚未完成此步，请确保从 Github [克隆 Lexicon 仓库](quick-start#installation)。

### 配置 Discourse 实例（如果需要） {#setup-a-discourse-instance-if-necessary}

你需要一个正在运行的 Discourse 站点才能开始开发 Lexicon Stack。

顺便回顾一下，Lexicon Stack 由以下组成：

- Lexicon App
- The Lexicon Prose GraphQL API
- 一个可用的 Discourse 站点

没有 Discourse 站点，Prose GraphQL API 就无法获取数据。而当 Prose GraphQL API 无法获取任何数据时，Lexicon 移动应用程序也无法接收任何数据。

有关设置本地开发实例的详细说明，请转到 [教程](./tutorial/setup-discourse)，该教程将引导您完成整个过程。

但是，如果您已经部署了 Discourse 站点，我们建议使用该它。

### 安装 Lexicon Discourse 插件 {#install-the-lexicon-discourse-plugin}

Lexicon Discourse 插件是一个 Discourse 插件，它为 [推送通知](./push-notifications/introduction.md) 和 [电子邮件深度链接](./email-deep-linking/intro.md) 提供支持。

您可以按照 [Discourse 插件文档](./discourse-plugin.md) 中的说明在您的 Discourse 实例中安装插件。

对于本地开发，您只能测试推送通知，因为电子邮件深度链接需要具有 [有效 app scheme](https://docs.expo.dev/versions/latest/config/app/#scheme) 的已发布应用程序。

如果您希望针对插件本身进行开发，可以在[此处](https://github.com/lexiconhq/discourse-lexicon-plugin.git)获取源码。

### 配置 {#configuration}

Lexicon Stack 的配置需要一些工作，以便与您的 Discourse 服务器正确交互。

这涉及配置后端 GraphQL API，该 API 与您的 Discourse 站点交互；以及前端移动应用程序，该应用程序与 GraphQL API 交互。

此设置的架构在 [Lexicon Stack 架构](concepts#architecture-of-the-lexicon-stack) 中有所描述。

#### 后端 GraphQL API 配置 {#backend-graphql-api-configuration}

[Prose GraphQL API](concepts#prose-discourse-through-graphql) 在配置方面相当简单。在最简单的情况下，它只需要知道您的 Discourse 站点在哪里可以访问。

它通过 `api/` 目录中的根目录中的 [`.env` 文件](https://www.codementor.io/@parthibakumarmurugesan/what-is-env-how-to-set-up-and-run-a-env-file-in-node-1pnyxw9yxj) 接收其配置。

以下是 `api/.env` 文件的最简单配置：

```
PROSE_DISCOURSE_HOST=https://meta.discourse.org
```

值得注意的是，您还可以选择配置 Prose API 服务器监听的 **主机名** 和 **端口号**，它们的默认值分别为 **localhost** 和 **80**。

```
PROSE_DISCOURSE_HOST=https://meta.discourse.org

# Instruct Prose to broadcast publicly instead of on localhost
PROSE_APP_HOSTNAME=0.0.0.0

# Instruct Prose to listen on port 8929 instead of the default port 80
PROSE_APP_PORT=8929
```

这些[Prose 环境变量](env-prose)是可选的，但是在某些情况下可能会很有用。

#### 前端移动应用程序配置 {#frontend-mobile-app-configuration}

:::note
在最初的 Lexicon 中，**Prose URL** 是在 `frontend/.env` 中指定的。但是，作为迁移到 Expo 的 EAS 功能的一部分，我们将配置集中到 `frontend/Config.ts` 中，以省去您在多个地方维护它的麻烦，正如[Expo 文档](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)中建议的那样。
:::

你需要先在 `frontend/app.json` 中设置你的应用名称和 slug 来配置移动 APP。[slug](https://docs.expo.dev/workflow/glossary-of-terms/#slug) 也被用作 Expo Web 服务上应用程序的 URL 的一部分，因此建议使用 kebab-case（例如，`my-lexicon-app`）。

请注意，这些占位符是您的应用程序的名称和 slug，您需要将它们替换为您想要的值：

```json
    "name": "<your app name>",
    "slug": "<your app slug>",
```

接下来，将 `frontend/Config.ts` 中的 `proseUrl` 的值更改为您的 Prose GraphQL API 的 URL，无论是本地还是已经部署在某个地方。

```ts
const config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://preview.myserver.com:8080/subpath',
    },
    production: {
      proseUrl: 'https://myserver.com/api/prose',
    },
  },
};
```

`localDevelopment.proseUrl` 会在您使用 `npm run start` 或 `expo start` 运行应用程序进行开发时被使用，而在实际构建应用程序时将使用 `buildChannels` 中的特定值（例如，`production.proseUrl`）。

#### 开发场景 {#development-scenarios}

在本地开发时，您可能会发现自己处于至少三种不同的场景中。

根据您所处的场景，`frontend/Config.ts` 和 `api/.env` 可能需要不同的配置。

##### 场景 1：现有 Prose 部署 {#scenario-1-existing-prose-deployment}

如果您已经将 Prose GraphQL API 部署到可以公开访问的主机上，您将已经使用正确的值设置了 `api/.env`。

在此情况下，`frontend/Config.ts` 只需要更新以指向已部署的 GraphQL API。

例如：

```ts
const config = {
  localDevelopment: {
    proseUrl: 'https://my-deployed-graphql.api',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://my-deployed-graphql.api',
    },
    production: {
      proseUrl: 'https://my-deployed-graphql.api',
    },
  },
};
```

在上面的示例中，我们已经配置了应用程序在所有情况下都指向 `https://my-deployed-graphql.api`，包括在使用 `npm run start` 运行时。

##### 场景 2：本地运行 Prose 并从模拟器访问 {#scenario-2-run-prose-locally--access-from-a-simulator}

:::info
如果您在本地运行 Prose 服务器，只有在部署了 Prose 的开发设备在运行状态时 Lexicon 才能正常工作。如果你需要在不依赖于开发设备的情况下使用移动应用程序之前，您必须先**部署** Prose 服务器。
:::

这种方法包含在开发机器上同时运行 Lexicon 移动应用程序和 Prose GraphQL API。这是通过指示 Expo 在 Android 或 iOS 模拟器中启动移动应用程序来实现的。

当以这种方式进行开发时，您可以简单地将 `frontend/Config.ts` 中的 `localDevelopment.proseUrl` 设置为 `http://localhost`。然后在 `api/.env` 中，您可以将 `PROSE_APP_HOSTNAME` 设置为 `0.0.0.0`。

请注意，如果您希望在特定端口上本地运行 Prose，您需要确保 `api/.env` 和 `frontend/Config.ts` 中的配置正确反映了这一点。

:::caution
如果您在 `api/.env` 中配置 `PROSE_APP_HOSTNAME` 仅监听 `localhost` 或 `127.0.0.1`（而不是 `0.0.0.0`），则会阻止同一网络上的其他人访问它。这包括您的移动设备和 Android 模拟器，这可能会导致在本地开发时出现连接问题。
:::

##### 场景 3：在本地运行 Prose 并从移动设备访问 {#scenario-3-run-prose-locally--access-from-your-mobile-device}

使用真实移动设备上的应用程序进行开发和调试非常有用，您可以使用 [Expo Go 应用程序](https://expo.dev/client)在真实的移动设备上开发和调试应用程序。

为了实现这一点，您需要确保您的开发设备是可以从移动设备上访问得到的。

使其可访问的一个简单方法是确保您的移动设备和开发设备连接在同一网络上，然后在 `api/.env` 中，将 `PROSE_APP_HOSTNAME` 设置为 `0.0.0.0`。

在常规的 Expo 项目中，您需要更新 `frontend/Config.ts` 中的 `localDevelopment.proseUrl` 值，以硬编码的方式配置您的开发设备在网络上的 IP 地址。

然而，通过将值设置为 `http://localhost`，我们默认情况下**自动**处理这一点，因此您无需担心。[这里](env-mobile#infer_development_host)有更多信息。

##### 硬编码本地 IP 地址 {#hardcoding-your-local-ip-address}

:::info
这种方式并不理想。如果您的本地 IP 地址发生变化，您将需要重新查找它，并更新 `Config.ts` 以反映这一点。因此，最好只使用 `http://localhost`。
:::

要手动指示移动应用程序如何定位您的开发设备，您需要找出您的开发设备在当前网络上的 **本地 IP 地址**。

请注意，您的本地 IP 地址与您的公共 IP 地址不同。

如果您不确定如何获取本地 IP 地址，您可以转到 [What Is My Browser: Detect Local IP Address](https://www.whatismybrowser.com/detect/what-is-my-local-ip-address) 并按照说明操作。

网站本身可能无法自动检测到您的本地 IP 地址，但它将为您提供有关如何在特定操作系统中找到它的说明。

您将获得一个类似 `10.0.12.121` 或 `192.168.17.69` 的 IP 地址。

然后，您可以将 `frontend/Config.ts` 中的值更新为您的本地 IP 地址。

这将允许在您的移动设备上运行的应用程序正确定位在您的开发设备上运行的 GraphQL API。

## 配置您的 Discourse 站点 {#configure-your-discourse-host}

如上所述，您需要设置一个 Discourse 站点，以便 GraphQL API 与之交互。

我们想简要介绍一下在继续之前设置 Discourse 主机的不同方法。

**1. 本地运行 Discourse 实例**

:::note
请确保正确管理所有端口。

Discourse 的开发设置使用 Docker，其中使用了多个端口，其中之一是 **端口 3000**。您需要仔细检查没有其他的环境变量占用 Discourse 要使用的端口。
:::

如果您想在本地运行 Discourse 站点进行开发，建议使用 **[Docker](https://www.docker.com/)**，因此请确保已安装它。

然后，如上所述，您可以按照 [教程中的这些步骤](tutorial/setup-discourse) 在 Docker 中安装和运行 Discourse 的开发实例。

**2. 使用 try.discourse.org 或其他流行的 Discourse 站点**

:::info
可以随意使用现有的公共 Discourse 站点，例如 [Docker Community Forum](https://forums.docker.com/) 或 [Rust Programming Language Forum](https://users.rust-lang.org/)，以测试 Lexicon 移动应用程序。

只需注意您如何在这些站点上进行贡献即可。
:::

[Try Discourse](https://try.discourse.org/) 是一个公开可访问的 Discourse 站点，旨在用于测试。因此，它每天都会重置。

您可以在这里注册一个新用户，然后在 Lexicon 移动应用程序中使用登录凭据。

使用这种方法，您只需在 `api/.env` 中配置 Prose 指向这些实例之一的主机。

```bash
PROSE_DISCOURSE_HOST=https://try.discourse.org
```

## 准备开发环境 {#prepare-the-development-environment}

现在您已经为开发做好了准备，可以开始深入了解 Lexicon 代码库。

### 运行 Lexicon 移动应用程序和 Prose GraphQL 服务器 {#run-the-lexicon-mobile-app--prose-graphql-server}

您可以通过运行以下命令 **从项目根目录** 运行移动应用程序并使用本地 Prose 服务器进行测试：

```
$ npm run dev
```

这会同时启动两个进程：

- GraphQL API 服务器
- 本地 Expo 开发服务器，它将使您能够从设备启动 React Native 应用程序

但是，如果您希望分别运行前端和后端，请在终端中执行以下命令以运行前端：

```
$ npm run --prefix frontend start
```

然后在另一个终端中执行以下命令以运行后端：

```
$ npm run --prefix api dev
```

### 调试 {#debugging}

- 使用 [Expo Developer Menu](https://docs.expo.io/workflow/debugging/#developer-menu) 可以使调试过程更容易。

根据不同的设备选择合适的方式打开 Expo Developer Menu：

- 在 iOS 设备上：摇动设备，或者用 3 个手指触摸屏幕。
- 在 iOS 模拟器上：在模拟器中按 `⌘ + ctrl + Z`。
- 在 Android 设备上：垂直摇动设备，或者在终端窗口中运行 `adb shell input keyevent 82`。
- 在 Android 模拟器上：按 `⌘ + M`，或者在终端窗口中运行 `adb shell input keyevent 82`。

- 如果您的更改没有显示出来，可能与缓存有关。在这种情况下，您应该尝试重新启动 Expo。
  - 为此，请在运行的终端中按 `Ctrl + C` 退出进程。
  - 然后再次运行 `npm run start`。
  - 如果问题仍然存在，您应该查找 Expo 的最新指导，因为它已知会发生变化。

### 运行测试套件 {#running-the-test-suites}

在运行测试之前，请仔细检查您的更改是否不包含任何错误。

您可以通过从项目根目录运行以下命令依次运行前端和后端代码库中的测试：

```
$ npm run test
```

确保所有测试都已通过，该命令还会通知您是否存在任何 Typescript 错误或来自 Prettier 或 ESLint 的问题。

还要注意，在运行 `npm run test` 之前，会触发前端中的另一个操作。

一个新的文件夹 `frontend/generated` 将被创建，并填充所有 GraphQL Query 和 Mutation types，以供代码库使用。

如果我们在测试之前没有运行这个，由于类型错误，测试会失败。

### 构建和发布 Lexicon 移动应用程序 {#build--publish-the-lexicon-mobile-app}

:::note
要想使用 Expo 的服务，您需要一个 Expo 账户。您可以在这里创建一个：https://expo.io/signup。
一旦您创建了 Expo 账户，请确保您已经在当前 shell 会话中登录了您的 Expo 账户，通过 `expo login` 或 `eas login`。
:::

在构建 Lexicon 移动应用程序之前，您需要先通过运行以下命令配置 EAS 构建：

```bash
eas build:configure
```

然后，您将从 EAS CLI 得到与 EAS 项目 ID 相关的提示：`android.package` 和 `ios.bundleIdentifier`。如果您有一个现有的项目 ID，EAS 将为您提供一个现有的项目 ID，否则会要求您创建一个新的项目 ID。至于 `android.package` 和 `ios.bundleIdentifier`，您可以使用 `com.companyname.appname` 或您可能更喜欢的任何其他模式来指定这些值。

完成后，请验证您将在 `Config.ts` 中用于实际构建应用程序的 `proseUrl` 值。

:::info
在发布应用程序时，有必要将 Prose 部署在某个公开可访问的地方，例如在 AWS 或 DigitalOcean 这样的云托管提供商上。如果 Prose 仅在您的本地机器上运行，那么下载您的应用程序的用户将无法使用它。
如果你尚未部署 Prose，请查看[文档](deployment)。
:::

现在，您可以通过 Expo（EAS）使用预览构建配置文件构建移动应用程序，运行以下命令：

```bash
eas build –platform all –profile preview
```

当您这样做时，打包程序将会压缩所有代码并生成两个版本的代码——一个用于 iOS，一个用于 Android——然后将它们都上传到 Expo CDN。

此外，如果您尚未优化应用程序的资产，Expo 将询问您是否要这样做。

这与手动运行 `npx expo-optimize` 具有相同的效果。它只是压缩项目中的所有图像资产，以减小构建的大小。

完成后，您将看到一个可共享的二维码和一个类似于 https:xxxxx.xxxxx@xxxxxxxxxxxxxxxxxxx 的 URL，该 URL 将您引导到 Expo 的 Web 控制台中的构建详细信息。

此时，任何人都可以使用该链接加载您的项目。

对于 Android，您可以将应用程序安装在模拟器或物理设备上。但是，对于 iOS，您只能将其安装在 iOS 模拟器上。要在真实的 iOS 设备上运行应用程序，请按照[教程](tutorial/building#1-preview)中的步骤。

在构建应用程序时，建议首先构建预览构建，并确保一切正常运行，然后再使用生产配置文件构建发布。

要使用生产构建配置文件构建应用程序，请运行以下命令：

```bash
eas build –platform all –profile production
```

完成后，您将看到与预览构建相同的输出。您还将看到指向 Expo 中构建详细信息的链接。

但是，与预览构建不同，发布构建不会生成一个可安装的二进制文件。您需要发布应用程序，然后从 Play Store 或 App Store 安装它。

您可以在[教程](tutorial/building)的这一部分中阅读更详细的解释。

#### 更新 {#updates}

如果您稍后想要部署 Lexicon 移动应用程序的更新，您可以使用 EAS 更新命令。

首先，请确保通过运行以下命令配置 EAS 更新：

```bash
eas update:configure
```

此命令将自动向您的 `app.json` 文件添加 `expo.runtimeVersion` 字段。
您将在终端中看到一个警告，告诉您要将 `expo.updates.url` 添加到 `app.json`。

然后运行以下命令来更新您的项目：

```bash
eas update -–branch <channel name>
```

:::note
channel 名称与构建配置文件相同，因此对于预览构建，您可以运行：

```bash
eas update -–branch preview
```

:::

有关更新应用程序的更多信息，请在[此处](tutorial/updating)阅读。

新版本发布后，下次用户打开应用程序时，新版本将对他们可用。

更多有关此过程的详细信息，包括发布到 App Store 和 Google Play Store，请按照[发布您的应用程序](tutorial/publishing)中的说明。

#### 配置 GraphQL API 与您的 Discourse 服务器 {#configure-the-graphql-api-with-your-discourse-server}

为了发布版本的应用程序能够联系您的 Discourse 服务器，您需要确保：

- GraphQL API 已部署并在从应用程序本身可访问的主机上运行正常
- GraphQL API 已配置为指向您的 Discourse 服务器的正确主机和端口
- 您的 Discourse 服务器可以通过 GraphQL API 访问
