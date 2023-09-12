---
title: 快速开始
---

## 相关依赖

- Node.js 16.14 或更新版本
- 适用于 Node 16.14 或更新版本的 NPM or Yarn
- EAS CLI 3.7.2 或更新版本，用于编译和发布应用
- 一个可用的 Discourse 站点
  - 如果你还没有可用的站点，请先参考[配置指南](setup#discourse-host)进行配置。

:::note
按照[安装指南](tutorial/setup)中的说明安装必备依赖项，例如 NPM 和 EAS CLI。
:::

## 安装

克隆源码仓库至本地，并进入仓库根目录:

```
git clone git@github.com:lexiconhq/lexicon.git
cd lexicon
```

安装项目依赖然后生成对应的 GraphQL schema:

```
$ npm install && npm run generate
```

其中， `npm run generate` 完成了两个任务.

- 第一, 它会在 `api` 文件夹生成一个 [GraphQL schema](https://nexusjs.org/docs/guides/schema).

- 随后, 它会在 `frontend` 内用上一步生成的 schema ,创建一个包含查询（query）和修改（mutation）类型的文件夹 `generated`.

- 这两步使得前端代码库与 `api` 目录中的类型保持同步，避免了前端为此重复编写代码。

这样一来，移动应用在前端使用的 GraphQL 库 [Apollo](https://github.com/apollographql/apollo-tooling) 可以使用从 API 共享的代码，从而使得应用能够查询正确的 API。

## 运行应用

你可以在项目根目录运行如下命令，直接启动应用进行测试:

```
$ npm run quickstart
```

这一步会同时启动两个进程:

- Prose GraphQL API 服务器
- Expo 本地开发服务器, 通过它可以在你的设备上运行 React Native 应用

**Please note that this takes some configuration to setup properly**.

- The `quickstart` command configures the Mobile App and the Prose GraphQL API to point at https://meta.discourse.org, as an example.

- You'll need to make adjustments to point at a site of your choice.

- The Lexicon Mobile App (via Expo) must be configured to point at the Prose GraphQL Server

- The Prose GraphQL Server must be configured to point at an active Discourse instance

More details are available in the [Development Setup](setup) section
