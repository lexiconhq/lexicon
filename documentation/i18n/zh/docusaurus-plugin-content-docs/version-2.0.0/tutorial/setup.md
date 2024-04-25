---
title: 配置开发环境
---

## 安装 NodeJS {#install-nodejs}

如果您尚未安装 NodeJS，请在您的计算机上安装 NodeJS。

Lexicon 配置所需的工具主要依赖于 Node 和 npm。

如果您不知道如何安装 NodeJS，您可以按照 [NodeJS 网站](https://nodejs.org/en/download/) 上的说明进行操作。

### 支持的 Node 版本 {#supported-node-versions}

建议您使用与项目的 Expo 版本兼容的最新 Node 版本执行本教程。

你可以在 [frontend/package.json](https://github.com/lexiconhq/lexicon/blob/master/frontend/package.json) 中查看依赖及其版本。

如果你当前的开发环境不方便切换 Node 版本，我们建议使用 [`nvm`](https://github.com/nvm-sh/nvm) 快速切换 Node 版本。

### 安装 yarn（如果您更喜欢） {#install-yarn-if-you-prefer}

Lexicon 不使用 [Yarn](https://yarnpkg.com/)（Node 的另一种包管理器）的任何特殊功能。如果您更喜欢它，它将与运行 `npm install` 一样工作。

为了编写本教程，我们将演示所有命令使用 `npm`。

### 克隆 Lexicon 仓库 {#clone-the-lexicon-repository}

在您的开发机器上选一个想存储此代码仓库的位置，克隆 Lexicon 仓库并 `cd` 进入其中。

```sh
git clone git@github.com:lexiconhq/lexicon.git
cd lexicon
```

### 安装依赖 {#install-dependencies}

接下来，安装 Lexicon 的依赖项：

```sh
npm install
```

这将为移动应用和后端 GraphQL API Prose 安装依赖项。

### 安装 Expo CLI {#install-the-expo-cli}

[Expo](https://expo.io/) 是 Lexicon 用来开发和构建移动应用的绝佳工具链。

我们稍后将使用 Expo CLI 来启动移动应用 - 无论是在您的设备上还是在模拟器中。

您可以使用以下命令安装 Expo CLI：

```sh
npm install --global expo-cli
```

更多信息请参阅 [Expo 文档](https://docs.expo.io/)。

然后，使用以下命令验证 Expo 是否在您的 `PATH` 中：

```sh
$ expo --version
<current version will be displayed>
```

### 安装 EAS CLI {#install-the-eas-cli}

[Expo 应用服务（EAS）](https://expo.dev/eas/) 是 Expo 和 React Native 应用的一组集成云服务。

我们将使用 EAS CLI 来构建和发布移动应用。

您可以使用以下命令安装 EAS CLI：

```sh
npm install --global eas-cli
```

更多信息请参阅 [Expo 文档](https://docs.expo.dev/eas/)。

然后，使用以下命令验证 EAS 是否在您的 `PATH` 中：

```sh
$ eas --version
eas-cli/<current version>
```

### 准备就绪！ {#ready-to-go}

这就是我们在本步骤中所需要的全部内容。

随后，我们将介绍如何在云服务商上配置 Discourse 服务器。此内容属于可选内容，如果您已经熟悉此过程或无需此操作，可以跳过。

之后，我们将探讨如何准备 Discourse 以连接 Lexicon 移动应用。

如果你还没有配置好 Discourse 服务器，我们将介绍如何配置。
