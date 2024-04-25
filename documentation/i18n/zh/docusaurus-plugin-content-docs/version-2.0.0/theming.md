---
title: 主题
---

:::note
本节将涉及阅读和修改 Typescript。如果遇到困难，请联系我们。
:::

Lexicon 允许您自定义移动应用程序提供的默认主题。

你可以通过修改`frontend/src/constants/theme` 或 `frontend/src/theme` 中的参数来实现这一点。

这两者之间有所不同，并且它们相互配合使用。

`frontend/src/constants/theme` 定义了主题的基础值。

然后`frontend/src/theme` 导入这些值，并使用它们来组合实际的主题对象，该对象在移动应用程序的其余部分中使用。

## 颜色 {#colors}

### 调整基础和功能颜色 {#adjusting-base--functional-colors}

移动应用程序中有两种类型的颜色：基础颜色和功能颜色。

基础颜色是主题的基本调色板，而功能颜色定义了基础颜色的特定用例。

例如，您可能已经注意到移动应用程序使用漂亮而引人注目的皇家蓝作为其主要颜色。

这在基础颜色中定义为：

```ts
// ...
royalBlue: '#2B6AFF',
// ...
```

然后，功能颜色利用这一点来为应用程序中的特定组件提供颜色。

继续看这个例子，`royalBlue` 基础颜色在功能颜色中被引用为：

```ts
// ...
activeTab: BASE_COLORS.royalBlue,
// ...
primary: BASE_COLORS.royalBlue,
// ...
```

现在，任何组件都可以引用功能颜色的 `primary` 值，它将是 `royalBlue`。

当然，如果您想要一个不同主题的新颜色，例如 `BASE_COLORS.lightningYellow`，那么您可以调整为：

```ts
// ...
activeTab: BASE_COLORS.lightningYellow,
// ...
primary: BASE_COLORS.lightningYellow,
// ...
```

然后移动应用程序将用您为亮黄色定义的值替换皇家蓝。

因此，如果您想添加更多颜色，您需要首先添加基础颜色值，然后在功能颜色中访问它们。

这种方式保持了关注点的清晰分离，使主题更改能够无缝传播到移动应用程序中。

### 调整颜色方案（暗色模式和亮色模式） {#color-scheme-dark-mode-and-light-mode}

主题允许您控制用户如何调整应用程序的颜色方案，如果有的话。

这有三种选择：暗色 `dark`、亮色 `light`、无偏好（默认） `no-preference`。

- 暗色：强制颜色方案保持暗色
- 亮色：强制颜色方案保持亮色
- 无偏好（默认）：允许用户指定颜色方案的偏好

注意，如果您指定了 `dark` 或 `light`，您的用户将**没有**选择颜色方案偏好的选项。

这在移动应用程序中体现为隐藏通常出现在首选项场景中的暗色模式按钮。

## 字体 {#fonts}

主题的字体在 `frontend/src/constants/theme/fonts` 中定义。

在该文件中，您可以找到调整的字体的多个属性：

- 字体变体
- 字体大小
- 标题字体大小

### 字体变体 {#font-variants}

用于为变体配置字重。它支持以下值：

| Variants | Default font weight |
| -------- | ------------------- |
| 粗体     | 700                 |
| 半粗体 | 600                 |
| 正常   | 400                 |

### 字体大小 {#font-sizes}

用于设置整个应用程序中一致的字体大小。它支持以下值：

| Variants         | Default size |
| ---------------- | ------------ |
| xl (extra large) | 24           |
| l (large)        | 18           |
| m (medium)       | 16           |
| s (small)        | 14           |
| xs (extra small) | 12           |

### 标题字体大小 {#heading-font-sizes}

用于为标题元素（如 `h1`、`h2` 等）配置字体大小。

这些值主要用于呈现来自 Discourse 的帖子和消息的内容。

这是因为 Discourse 帖子是用 Markdown 编写的，用户通常会利用标题元素来格式化他们的帖子。

| Variants       | Default size |
| -------------- | ------------ |
| h1 (Heading 1) | 32           |
| h2 (Heading 2) | 24           |
| h3 (Heading 3) | 22           |
| h4 (Heading 4) | 20           |
| h5 (Heading 5) | 18           |
| h6 (Heading 6) | 17           |

## 图标 {#icons}

`icons` 主题文件用于存储与图标相关的常量。

目前，`icons` 文件仅包含一个常量，它声明了图标大小的比例。

| Variants         | Default size |
| ---------------- | ------------ |
| xl (extra large) | 28           |
| l (large)        | 24           |
| m (medium)       | 20           |
| s (small)        | 18           |
| xs (extra small) | 16           |

## 图像 {#images}

`images` 主题文件用于存储在渲染图像中使用的主题常量。

目前，该文件声明以下主题值：

- Avatar 图标大小
- Avatar 字母大小
- Avatar 图像大小

Avatar 在整个应用程序中用于显示有关帖子或消息的相关信息。

一般来说，它通常是用户自定义的头像。

然而，当没有提供头像时，我们还会根据用户的首字母生成一个基于字母的头像。

### Avatar 图标大小 {#avatar-icon-size}

| Variants         | Default size |
| ---------------- | ------------ |
| l (large)        | 96           |
| m (medium)       | 52           |
| s (small)        | 40           |
| xs (extra small) | 28           |

### Avatar 字母大小 {#avatar-letter-size}

| Variants         | Default size |
| ---------------- | ------------ |
| l (large)        | 72           |
| m (medium)       | 36           |
| s (small)        | 28           |
| xs (extra small) | 16           |

### Avatar 图像大小 {#avatar-image-size}

This defines the quality of the image used for avatars.

| Variants         | Default size |
| ---------------- | ------------ |
| xl (extra large) | 450          |
| l (large)        | 150          |
| m (medium)       | 100          |
| s (small)        | 50           |

## 间距 {#spacing}

`spacing` 主题文件定义了在移动应用程序中用于填充和边距的间距常量。

| Variants                  | Default size |
| ------------------------- | ------------ |
| xxxl (triple extra large) | 36           |
| xxl (double extra large)  | 24           |
| xl (extra large)          | 16           |
| l (large)                 | 12           |
| m (medium)                | 8            |
| s (small)                 | 4            |
| xs (extra small)          | 2            |

## 高级自定义 {#advanced-customization}

虽然上述调整通常相当简单，但您可以根据自己的技能水平真正自定义移动应用程序（基于您的技能水平）。

以下是一些额外的示例。

### 自定义字体 {#custom-fonts}

#### 创建一个用于自定义字体的文件夹 {#create-a-folder-for-the-custom-fonts}

为了保持代码库的结构，您可以在 `frontend/assets` 中创建一个名为 `fonts` 的文件夹。

然后，您可以将自定义字体资源移动到此文件夹中。

#### 安装并使用 `expo-font` 包 {#install--use-the-expo-font-package}

这个包简化了将自定义字体添加到基于 Expo 的应用程序的过程。

特别是，您将使用其中的 `loadAsync` 函数，该函数将您的字体资源映射到移动应用程序中的变体名称。

虽然我们不会在这里详细介绍太多技术细节，但他们的[文档](https://docs.expo.dev/versions/latest/sdk/font/)可以指导您完成这个过程。

### 错误消息 {#error-messages}

在移动应用程序中，错误消息是用户与应用程序交互时的重要部分。

为了更改或添加新的错误消息，您需要了解两个文件。

#### `frontend/src/helpers/errorMessage.ts` {#frontendsrchelperserrormessagets}

Prose GraphQL API 会将来自 Discourse 的错误消息转发。

此文件将这些消息的具体文本声明为常量，以便可以轻松地在 `errorHandler.ts` 中进行比较。

如果您观察到任何未被捕获的额外错误消息，您需要将它们添加到此文件中，然后相应地调整下面的 `errorHandler.ts`。

#### `frontend/src/helpers/errorHandler.ts` {#frontendsrchelperserrorhandlerts}

此文件从上面的 `errorMessage.ts` 导入。

然后，当遇到错误时，它定义了如何处理错误，包括上面的消息。

目前，默认方法是向用户显示错误消息。

但是，如果您想集成 snackbar，您需要调整 `errorHandler.ts` 中的代码，以替换 `Alert.alert` 的调用。
