---
title: 快速入门
---

## 依赖 {#prerequisites}

- Node.js 16.14 或更新版本
- 与 Node 16.14 或更新版本兼容的最新版本的 NPM 或 Yarn
- EAS CLI 3.7.2 或更新版本，用于构建和发布应用
- 一个可用的 Discourse 站点
  - 如果没有，请按照[开发配置](setup#discourse-host)中的说明操作

:::note
请按照[配置指南](tutorial/setup)中的说明安装依赖，例如 NPM 和 EAS CLI。
:::

## 安装 {#installation}

首先，克隆本仓库并进入其中：

```
git clone git@github.com:lexiconhq/lexicon.git
cd lexicon
```

接下来，安装项目的依赖项并生成其 GraphQL schema：

```
$ npm install && npm run generate
```

`npm run generate` 包含两个步骤：

- 首先，它将在 `api` 目录中生成一个 [GraphQL schema](https://nexusjs.org/docs/guides/schema)。

- 然后，使用生成的 schema，它将在 `frontend` 目录中创建一个名为 `generated` 的新文件夹，其中包含 the resulting query and mutation types。 这使得前端代码库可以与 `api` 目录中的类型保持同步，而无需重复编程。

从 API 共享的代码被 [Apollo](https://github.com/apollographql/apollo-tooling)(我们使用的前端 GraphQL 库) 使用, 使得移动应用可以正确地查询 API。

## 启动移动应用 {#launch-the-mobile-app}

你可以通过从项目根目录运行以下命令来运行 Lexicon 移动应用并测试它：

```
$ npm run quickstart
```

这将同时启动两个进程：

- Prose GraphQL API 服务器
- 本地 Expo 开发服务器，使您可以从设备上启动 React Native 应用

**请注意，正确运行需要一些恰当的配置**。

- `quickstart` 命令配置了移动应用和 Prose GraphQL API，作为示例，使其指向 https://meta.discourse.org 。

- 您需要进行调整，以指向您选择的站点。

- Lexicon 移动应用（通过 Expo）必须配置为指向 Prose GraphQL 服务器

- Prose GraphQL 服务器必须配置为指向一个可用的 Discourse 站点

更多细节请参见[开发配置](setup)部分
