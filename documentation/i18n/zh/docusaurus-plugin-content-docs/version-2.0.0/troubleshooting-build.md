---
title: 异常排查
---

<head>
 <link rel="preload" as="image" href={useBaseUrl('/img/screenshot/Please_connect_network_error.png')}/>
</head>

import useBaseUrl from '@docusaurus/useBaseUrl';

## 无法连接到 URL 的连接和配置问题 {#troubleshooting-connection-and-configuration-issues-with-url}

<div style={{textAlign: 'center'}}>
  <img loading="eager" alt="please connect to network error" className="carousel-image" src={useBaseUrl('/img/screenshot/Please_connect_network_error.png')}/>
</div>

如果您遇到与 URL 相关的问题，导致错误消息显示“请连接到网络”，如屏幕截图所示，很可能是由于配置不正确引起的。具体而言，如果您正在尝试在移动设备上本地测试构建，并且 channel 字段未正确配置，则应用可能会持续回退到 localDevelopment 频道，即使您已将其设置为其他频道，如“preview”。

以下步骤和注意事项可帮助解决此问题：

- 打开项目中的 `frontend/Config.ts` 文件。
- 在文件中查找 `config` 对象。
- 在 `localDevelopment` 部分的 `config` 对象中，您可以添加特定于您要测试的频道的 Prose URL。此部分用于本地开发，并作为 EAS Build 中未知构建频道的默认配置。以下是一个示例：

  ```ts
  const config: Config = {
    localDevelopment: {
      proseUrl: 'http://localhost:8929',
    },
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

- 上面的示例显示了配置由两个主要部分组成：`localDevelopment`，它指定了本地开发期间的 URL，以及 `buildChannels`，其中包括不同频道的配置，如 preview 和 production。对于本地开发，它将使用 URL `http://localhost:8929` 访问 Prose API。如果构建频道未知或未找到，则始终会默认为 localDevelopment。
- 使用有效的 Prose 服务器 URL 为特定的构建更新 `proseUrl` 值，例如 `preview` 或 `production` 中的值。
- 进行了必要的更改之后，请保存 `frontend/Config.ts` 文件。

现在，当您为特定的构建频道运行 `eas build`，例如 `eas build --profile=production` 时，它将使用生产配置中指定的 Prose URL。

:::note
在 `frontend/app.json` 中包含 URL 是很重要的，expo-updates 将使用它来获取更新清单。如果未在 `frontend/app.json` 文件中设置 URL，expo-updates 将始终返回 undefined 作为频道的常量，导致应用在构建后始终使用 localDevelopment URL。您可以在 app.json 文件的 expo 和 updates 部分中指定此 URL。有关如何配置此项的更详细信息，请参考[expo 文档](https://docs.expo.dev/versions/latest/config/app/#url)。

```json
"expo": {
    "updates": {
      ...,
      "url": "https://u.expo.dev/<id project>"
    }
}
```

这种配置对于与项目中的 Config.ts 无缝集成至关重要。
:::

在某些情况下，当 `frontend/eas.json` 文件中指定的 channel 名称与 `frontend/Config.ts` 文件中定义的 `config` 变量中的相应键名不匹配时，可能会遇到与 Prose API URL 相关的问题。这种不一致可能会导致问题，因为 `eas.json` 中的 channel 名称用于确定将要使用的 URL。如果名称不匹配，则将使用默认的 `localDevelopment` URL。

为了确保顺利运行，请注意在 `frontend/eas.json` 文件和 `frontend/Config.ts` 文件中使用相同的 channel 名称。这将确保将 channel 名称正确映射到相应的 URL。

以下示例可帮助说明这一点：

```json
// frontend/eas.json

"build": {
    "staging": {
      "android": {
        "buildType": "apk"
      },
      "channel": "staging"
    }
}
```

```ts
// frontend/Config.ts;

const config: Config = {
  localDevelopment: {
    proseUrl: 'http://localhost:8929',
    inferDevelopmentHost: true,
  },

  buildChannels: {
    preview: {
      proseUrl: '<url>',
    },
    production: {
      proseUrl: '<url>',
    },
    staging: {
      proseUrl: '<url>',
    },
  },
};
```

## 应用闪退 {#the-app-closes-abruptly-after-the-splash-screen}

如果应用在启动时闪退，很可能是您的 `app.json` 文件中缺少配置引起的。一个常见的原因是在 `app.json` 中缺少 scheme 定义，这在应用构建过程中是必不可少的。

参照下述步骤解决此问题：

1. 打开项目的 `frontend/app.json` 文件。
2. 查找 `"expo"` 部分。
3. 如果 scheme 不存在，请在 `"expo"` 部分中添加以内容：

  ```json
  "expo":{
    "name": "<app name>",
    "slug": "<app-name>",
    "scheme": "<app-name>",
    "version": "1.0.0"
  }
  ```

  将 `"<app-name>"` 替换为您的应用程序的所需 scheme 名称。

4. 保存对 `app.json` 文件的更改。
5. 重新构建您的应用程序并再次测试。

在 `app.json` 中正确定义 scheme 后，您应该能够解决应用在启动时闪退的问题。
