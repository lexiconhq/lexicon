---
title: 应用图标和其他资产
---

Lexicon 移动应用程序包含很多资产，可以替换以进行白标。

可以修改的资产如下：

## 应用 Logo {#app-logo}

用于在应用程序中显示应用 Logo，例如在登录、注册和 2FA 场景中。

这些资产位于 `frontend/assets/images/logo.png` 和 `frontend/assets/images/logoDark.png`。`logo.png` 用于浅色主题，`logoDark.png` 用于深色主题。要自定义它，只需用您自己的 `logo.png` 和 `logoDark.png` 替换现有文件。

## Favicon {#favicon}

用于显示应用程序 Logo。

这些资产位于 `frontend/assets/favicon.png`。要自定义它，只需用您自己的 `favicon.png` 替换现有文件。

## 占位图像 {#image-placeholder}

用于在加载图像时暂时占据图像位置。

这些资产位于 `frontend/assets/images/imagePlaceholder.png`。要自定义它，只需用您自己的 `imagePlaceholder.png` 替换现有文件。

## 图标 {#icons}

用于在应用程序内显示图标。

这些资产位于 `frontend/assets/icons` 文件夹。如果您想添加更多图标或编辑剩余图标，需要将图标插入到 `frontend/assets/icons/` 文件夹，并在 `frontend/src/icons.ts` 中导入它们。

图标有一些标准，例如：

### 保持视觉一致性的统一图标尺寸 {#uniform-icon-size-to-maintain-visual-consistency}

UI 是围绕图标的默认基本尺寸 28x28px 设计的。

如果您调整此尺寸，您可能需要修改主题或字体的其他方面，以保持简洁的外观。

同样，如果您提供一个不符合这些尺寸的新图标，可能会遇到视觉效果不一致的问题。

### SVG 图标通过 `currentColor` 控制其填充颜色 {#svg-icons-have-their-fill-color-controlled-via-currentcolor}

如果您要添加一个新图标，希望它与主题的颜色交互，请确保其颜色未硬编码，并且设置为 `currentColor`。

如果您对这个概念不熟悉，请查看 [MDN 规范中的 SVG 颜色值](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/color)。
