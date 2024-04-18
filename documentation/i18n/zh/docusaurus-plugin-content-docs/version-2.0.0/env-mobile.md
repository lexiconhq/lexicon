---
title: 配置变量
---

您可以在 `frontend/Config.ts` 中检查和配置变量。

下表描述了 Lexicon 移动应用的可配置变量。

如果有默认值指示，如无需要则您无需设置它。

| 变量 | 是否必须 | 备注 | 默认值 | 示例值 |
| -------------------- | -------- | -------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| proseUrl             | Yes      | Prose Server 的url地址 (必须以 http 或 https 开始)                            | -             | https://prose.myserver.com https://prose.myserver.com:8080 https://prose.myserver.com/subpath https://prose.myserver.com:8080/subpath |
| inferDevelopmentHost | No       | 是否使用开发设备的地址覆盖默认的 localhost 地址 | (empty)       | true                                                                                                                                  |

## `config` 对象 {#the-config-object}

在 `Config.ts` 文件中，您会找到一个 `config` 对象，它允许您根据场景指定配置值。

主要有两种场景：

- `localDevelopment`：在本地开发应用时使用。这个配置也是未知构建通道情况下的默认选项。
- `buildChannels`：在使用 EAS CLI 构建应用时，用于定义构建通道的配置。

一般情况下您只需关心为这些部分配置 `proseUrl`。

## `proseUrl` {#proseurl}

:::caution
`proseUrl` 必须始终指定，无论是否包含端口号，且必须始终以 `http://` 或 `https://` 开始。
:::

`proseUrl` 用于指定 Prose GraphQL API 的 URL。

Prose GraphQL API 充当 Lexicon 移动应用和您的 Discourse 站点之间的传话人。没有它，移动应用无法与您的 Discourse 站点进行交互。

### 示例 {#example}

```ts
const config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
  },
  buildChannels: {
    preview: {
      proseUrl: 'https://preview.myserver.com',
    },
    production: {
      proseUrl: 'https://prose.myserver.com',
    },
  },
};
```

借助上述配置，应用将：

- 在使用 `npm run start` 运行应用时，指向 `http://localhost:8929`
- 在使用 `eas build --profile preview` 构建应用时，指向 `https://preview.myserver.com`
- 在使用 `eas build` 构建应用时，指向 `https://prose.myserver.com`

`proseUrl` 也可以包含子路径：

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

**在开发环境中的不同行为**

在本地运行应用时，如果 `proseUrl` 设置为 `http://localhost` 或 `http://127.0.0.1`，它将使用 Expo 的 `debuggerHost` 常量将 `proseUrl` 替换为您的开发机器的 IP 地址。

_注意：构建应用时不适用此规则。_

这解决了多个问题：

- 从 Android 模拟器内部访问 `localhost` 不会映射到您的开发设备
- 从运行 Expo Go 的设备访问 `localhost` 不会映射到您的开发设备

否则，这两种情况都需要您手动识别和指定开发设备的 IP 地址。但这很麻烦，因为您的机器的 IP 地址可能总在变化。

如果你想了解更多关于这个的细节，可以查看 `frontend/constants/app.ts` 中的实现。

如果您不希望这种行为发生，可以使用 `inferDevelopmentHost` 标志禁用它。

## `inferDevelopmentHost` {#inferdevelopmenthost}

:::info
此标志仅在 `localDevelopment` 下有效。在 `buildChannels` 中使用时不起作用。
:::

在开发时，默认情况下，Lexicon 移动应用会检查 `proseUrl` 是否设置为 `http://localhost` 或 `http://127.0.0.1` .

当检测到这两个值中的任何一个时，它们将被覆盖为您的开发设备的 IP 地址。

这是一个非常有用的功能，使得在设备上测试可以直接工作，而无需手动指定您的 IP 地址（或在更改时更新它）。

对于不希望这种行为发生的情况，`inferDevelopmentHost` 可以用作标志来禁用此行为。可以通过指定值 `false` 来禁用它。

当设置为 `false` 时，将不再发生覆盖 `proseUrl` 为开发设备的 IP 地址的行为，原始值将原样传递。

```ts
const config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
    inferDevelopmentHost: false,
  },
};
```
