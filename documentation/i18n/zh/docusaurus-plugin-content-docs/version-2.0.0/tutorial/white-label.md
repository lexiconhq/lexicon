---
title: 个性化应用
---

## 自定义启动画面和应用图标 {#customize-the-splash-screen-and-app-icon}

为了将应用定制为您自己的品牌，您可能希望为**启动画面**和**应用图标**提供自己的资源。

**启动画面** - 是应用启动时显示的内容。有些应用在将应用置于后台时也会显示这个内容，以帮助隐藏私人信息。

**应用图标** - 是用于在用户设备上表示应用的内容，例如在主屏幕上和在设备设置中列出应用时。

这两个资源通常包含您的标志或其他形式的标志。例如，Gmail 应用的 App 图标是一个多色信封的轮廓。然后，在启动 Gmail 应用时，您会注意到启动画面包含 App 图标的更大版本。

### 自定义启动画面 {#customizing-the-splash-screen}

:::info
Expo 目前尚不支持启动画面的暗色模式。
:::

在移动应用中用于启动画面的资源位于 `frontend/assets/images/splash.png` 和 `frontend/assets/images/splashDark.png`。

亮色模式和暗色模式的启动画面资源都已经准备好了。

但是 Expo 目前不支持启动画面的暗色模式。我们只是包含了这两个资源，以便在 Expo 以后支持时可以使用。

在此期间，您可以调整 `splash.png` 来影响显示的资源。

为了更改它，您可以简单地用您自己的 `splash.png` 文件替换现有文件。

要了解有关启动画面图像大小和其他详细信息，请参阅[Expo 启动画面指南](https://docs.expo.io/guides/splash-screens/)。

#### 进一步配置 {#futher-configuration}

要调整启动画面图像的大小并更改其背景颜色，首先打开 `frontend/app.json` 并找到其中的 `"splash"` 字段。

如下面的摘录所示，有多个字段可用于进一步调整启动画面：

```json
"splash": {
  "image": "./assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#FFFFFF"
},
```

**image**

`image` - 调整用于定位启动画面图像的路径。

**resizeMode**

**resizeMode** - 允许您管理启动画面图像的调整大小方式以保持其纵横比：

- `contain` - 调整图像大小以确保整个图像可见。这是默认设置。
- `cover` - 调整图像大小以覆盖整个容器（在这种情况下是整个屏幕），通过拉伸或裁剪图像来实现。

有关 `contain` 和 `cover` 行为的更多详细信息在之前提到的[Expo 启动画面指南](https://docs.expo.io/guides/splash-screens/)中有介绍。更详细的解释可以阅读[这篇文章](http://blog.vjeux.com/2013/image/css-container-and-cover.html)。

**backgroundColor**

`backgroundColor` - 允许您指定启动画面图像背后的背景颜色。删除此值将导致使用默认值，即白色背景颜色。

### 自定义应用图标 {#customizing-the-app-icon}

在 Lexicon 中自定义应用图标的过程与自定义启动画面几乎相同。

移动应用的图标资源位于 `frontend/assets/icon.png`。要自定义它，只需用您自己的 `icon.png` 文件覆盖该文件。

## 进一步定制 {#further-customization}

我们在[白标](../white-labeling)部分的文档中更详细地介绍了如何自定义您的应用。

特别是，这包括自定义和扩展主题的颜色调色板、图标，甚至字体。

如果您需要任何文档中尚未涵盖的内容，请与我们联系，我们将看看如何帮助您实现。

## 棒极了 {#awesome-work}

现在您的应用看起来很酷 😎。但是，它只能由您访问

接下来，我们将介绍如何实际[构建您的应用](building)，以便您可以与他人分享。
