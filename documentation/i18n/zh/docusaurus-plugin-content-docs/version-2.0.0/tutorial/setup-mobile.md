---
title: 配置并启动移动应用
---

import useBaseUrl from '@docusaurus/useBaseUrl';

完成上一小节之后，你的 GraphQL API 应该已经连接到你的 Discourse 站点。

接下来，我们将指导你通过 Prose 将 Lexicon 移动应用连接到你的 Discourse 站点。

### 配置移动应用 {#mobile-app-configuration}

:::note
在最初的 Lexicon 中，**Prose URL** 是在 `frontend/.env` 中指定的。但是，作为迁移到 Expo 的 EAS 功能的一部分，我们将配置集中到 `frontend/Config.ts` 中，以省去您在多个地方维护它的麻烦，正如[Expo 文档](https://docs.expo.dev/build-reference/variables/#can-i-share-environment-variables-defined-in-easjson-with-expo-start-and-eas-update)中建议的那样。
:::

在启动本地版本的 Lexicon 移动应用之前，你需要至少配置一个信息。

Lexicon 移动应用完全依赖于正在运行的 Prose GraphQL API 实例，以便从你的 Discourse 实例中检索数据。

因此，你需要指示它如何定位正在运行的 Prose 服务器。

#### 通过 `frontend/Config.ts` 配置 `proseUrl` {#configuring-proseurl-via-config}

:::caution

##### `proseUrl` 要求 {#proseurl-requirements}

请注意，`proseUrl` **必须**以 `http://` 或 `https://` 开头。否则，移动应用在启动时会抛出错误。
:::

`Config.ts` 包含了 `config` 对象，允许你在开发和构建移动应用时指定每个场景的 Prose URL。

具体要配置值是 `proseUrl`，它包含在 `config` 对象所表示的多个场景中。

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

如上所述，`config` 对象允许我们为多个场景表达配置值，这些场景包括：

- `localDevelopment`：在本地开发应用时。当构建通道未知时，此配置也会被用作默认值。
- `buildChannels`：在使用 EAS CLI 构建应用时，用于按构建通道定义配置。

`buildChannels` 使用 Expo 的构建通道（通常为 `preview` 和 `production`）作为其键值。

`buildChannels` 中的每个键值都映射到一个特定的 Prose URL，该 URL 将根据你为哪个通道构建而被用于构建版本。

在上面的示例中，当我们创建一个 `preview` 构建时，应用将被构建并配置为连接到位于 `https://preview.myserver.com:8080/subpath` 的 Prose 服务器。

同样，当我们创建一个 `production` 构建时，应用将被配置为连接到位于 `https://myserver.com/api/prose` 的 Prose 服务器。

```ts
const config = {
  localDevelopment: {
    proseUrl: 'https://myserver.com/api/prose',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://myserver.com/api/prose',
    },
    production: {
      proseUrl: 'https://myserver.com/api/prose',
    },
  },
};
```

##### 端口号 {#port-number}

请注意，如果你的 Prose 服务器不在端口 `80` 或 `443` 上运行，你还需要通过 `proseUrl` 指定 **端口号**。

例如，如果你在本地的端口 `8929` 上启动了一个 Prose 服务器，并尝试使用 `expo start` 运行它，那么你的 `Config.ts` 文件需要在 `localDevelopment.proseUrl` 下囊括 `http://myserver.com:8929/api/prose`。

### 启动移动应用 {#launch-the-mobile-app}

配置完成之后你一定会想要启动移动应用来测试它是否与正确的 Prose 服务器通信。

为了做到这一点，你可以简单地从项目根目录运行以下命令：

```bash
npm run --prefix frontend start
```

Expo 开发服务器应该会启动，你可以按照指示在模拟器或实际设备上运行应用。

#### 异常排查 {#troubleshooting}

如果应用在加载时抛出错误，你应该根据收到的消息再次检查你指定的配置值。

如果应用加载了，但你无法连接，你应该验证以下内容：

- 你的 Prose 服务器是否正在运行，并且在你在 `Config.ts` 中指定的端口上运行
- 你的 Prose 服务器是否配置为指向一个可访问的 Discourse 实例
- 你的 Discourse 实例是否正确运行

## 干得漂亮！ {#nice-work}

到此为止，你已经完成了很多工作。

你开始的 Discourse 服务器现在可以通过一个全新的原生移动应用访问，你可以自由定制它以适应你的需求。

在下一部分教程中，我们将简要讨论这个主题：通过[白标](white-label)为你的品牌定制移动应用。
