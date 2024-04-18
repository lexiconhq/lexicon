---
title: 发布应用
---

## EAS Submit {#eas-submit}

EAS Submit 是一个用于上传和提交应用二进制文件到 App Store 和/或 Play Store 的服务。
在[这里](https://docs.expo.dev/submit/introduction/)了解更多关于 EAS Submit 的信息。

### 准备 {#prerequisites}

- 在 App Store Connect 中注册应用，参见[这里](../app-store#register-a-new-bundle-id)的指南。
- 在 Play Store 中注册应用，参见[这里](../play-store)的指南。

### 配置 {#configuration}

在开始之前，你需要配置 `eas.json` 文件。这个文件用于指定构建配置文件和提交配置文件。

#### iOS {#ios}

对于 iOS，填写你的账户信息到 `appleId`、`ascAppId` 和 `appleTeamId`：

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
- **ascAppId**: 你的 App Store Connect app ID. 查阅[此教程](https://github.com/expo/fyi/blob/main/asc-app-id.md)以查询你的 ascAppID  (e.g., `1234567890`).
- **appleTeamId**: [在此](https://developer.apple.com/account/)查看你的 apple team ID (e.g., `12LE34XI45`).

#### Android {#android}

对于 Android，你需要添加一个 `.json` 密钥文件以在 Google Play Store 中进行身份验证。请按照[这个指南](https://github.com/expo/fyi/blob/main/creating-google-service-account.md)获取。然后，将 JSON 文件复制到你的 `lexicon/frontend` 目录，并将文件重命名为 `playstore_secret.json`。

JSON 文件如下所示：

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

配置结束，你可以开始提交应用了。

### 提交 {#submitting}

使用以下命令提交构建：

```bash
eas submit --platform ios --profile <submit-profile-name>
```

接下来，你将看到 EAS CLI 提示询问你想提交哪个应用。

有 4 种可选的选项：

- 选择 EAS 上的构建版本
- 提供应用存档的 URL
- 提供应用二进制文件的本地路径
- 提供 EAS 上现有构建的构建 ID

如果你使用 EAS Build 构建了应用或者遵循了[构建你的应用](building)教程，那么请选择第一种选项，并选择你想要的版本。

### 提交配置文件 {#submit-profiles}

默认情况下，`eas.json` 已经配置了两个提交配置文件，分别是 **staging** 和 **production**。

配置大部分相同，唯一的区别在于 Android 的提交选项。

- **staging** 表示该构建是 `internal` 的。这意味着使用 staging 配置提交的构建将在 Play Store 中进行内部测试。
- **production** 表示该构建是 `production` 的，将在 Play Store 中进行公开发布。

对于 iOS，两个配置文件都将在提交到 TestFlight 之前提交。

你可以参考 Expo 文档了解更多关于[Android-specific](https://docs.expo.dev/submit/eas-json/#android-specific-options) 和 [iOS-specific](https://docs.expo.dev/submit/eas-json/#ios-specific-options) 选项。

## 恭喜！ {#congratulations}

你的应用现在可以在 Play Store 和 App Store 上下载了！

到[下一节](updating)，也就是最后一节中了解更多关于如何更新你的应用或在线修复其中的异常。
