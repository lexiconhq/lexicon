---
title: 提交贡献
---

感谢您对提交贡献的兴趣! :sparkles:

我们十分感谢您为推动 Lexicon 进步而付出时间和精力。

这有一些指导可以帮助您更好地了解如何为 Lexicon 提交贡献。

## 反馈异常 {#reporting-bugs}

反馈给我们异常的最佳方式是在 [Github](https://github.com/lexiconhq/lexicon) [创建一个新的 issue] (https://github.com/lexiconhq/lexicon/issues/new)。

同时我们强烈建议在创建新 issue 之前搜索现有的开放或已经关闭的 issue。

在你创建 issue 时，请确保包含以下内容：

- 异常的详细描述及其表现

- 你期望的表现

- 复现异常的步骤

- 你观察到异常的设备和版本的详细信息

- 截图或屏幕录像，虽然不是必须的，但非常推荐

一旦我们收到您的异常报告，将对其进行分类并进行相应的标记。

## 向项目提交贡献 {#contribute-to-the-project}

想名列我们的贡献者列表 :clap:?

我们很乐意接收您提交的 PR，无论是解决现有问题、添加新功能，还是改进文档。

要开始贡献，请按照以下说明操作。

### 操作步骤 {#instructions}

**1. Fork [官方 Lexicon 仓库](https://github.com/lexiconhq/lexicon)**

您可能已经知道这个步骤 - 点击仓库右上角的 **Fork** 按钮。

**2. 克隆 Lexicon 的 Fork**

请确保将 **_您的_** fork 克隆到您的开发环境中（而不是克隆主 Lexicon 仓库）。

```
$ git clone https://github.com/YOUR_USERNAME/lexicon.git
```

如果您需要进一步指导，请查看我们的 [快速入门](quick-start#installation) 部分。

请注意，快速入门部分指导您克隆 Lexicon 仓库。因此，请确保将上述 URL 中的 `YOUR_USERNAME` 更改为您的用户名。

**3. 运行并连接应用程序至 Prose 和 Discourse 主机**

在这一步中，您需要确保 Lexicon 移动应用程序连接到您的 Prose 服务器和 Discourse 主机，参照 [**配置**](setup#discourse-host) 部分的说明。

如果您已经部署了一个指向 Discourse 站点的 Prose 服务，您只需配置 Lexicon 移动应用程序指向您的 Prose 部署地址即可。

但是，如果您没有已部署的 Prose，或者您打算对 Prose 服务器本身进行调整，您需要确保 Lexicon 移动应用配置为指向您本地运行的 Prose 服务器。

**4. 开始贡献**

到这一步，您应该已经准备好开始主要工作了，比如功能开发、修复 bug 或其他贡献。

请记住，您的 IDE 中需要安装 [**ESLint**](https://eslint.org/docs/user-guide/getting-started) 和 [**Prettier**](https://prettier.io/) 插件，因为这些是 Pull Request 检查所必需的。

我们建议使用 [VSCode](https://code.visualstudio.com/) 进行开发，因为这是我们用来开发 Lexicon 的 IDE。但是，这取决于您，只需确保您的 IDE 中的 ESLint 和 Prettier 正常运行即可。

**5. 运行测试套件**

请按照 [**步骤**](setup#run-the-test-suite) 运行 Lexicon 测试套件。

为了缩短反馈周期，建议您确保所有测试在本地都通过后再推送，尤其是如果您已经有一个开放的 PR。

这主要是因为我们已经配置了 Github 项目，如果任何构建步骤失败，将阻止 PR 合并。

如果审核发现测试失败，他们将无法快速审核，很可能会要求您在再次请求审核之前解决构建本身的问题。

**6. 暂存、提交并推送本地更改**

如果你对这些操作并不熟悉，请查看 Github 的这篇[优秀文章](https://github.com/git-guides/#learning--mastering-git-commands)学习操作。

**7. 创建新的 Pull Request**

你的代码已经准备好提交了！ :tada:

前往 Lexicon 的 [Pull Requests 选项卡](https://github.com/lexiconhq/lexicon/pulls)， 然后比较你的分支和主分支之间的更改。

再次检查并确保你没有推送任何不想包含在 PR 中的内容。

然后，从你 fork 的仓库中创建一个新的 Pull Request。

请确保遵循 Pull Request 模板，添加相关标签，并请提及你正在解决的问题，以帮助我们跟踪正在进行的工作。

## 和我们分享你的见解 {#share-your-thoughts-with-us}

我们非常感谢您的反馈和建议。如果您有任何新的想法，我们很乐意在 [Issues 标签页](https://github.com/lexiconhq/lexicon/issues)看到您的想法。

## 分享给更多人 {#spread-the-word}

如果您在社交媒体上分享您使用 Lexicon 的精彩体验，请告诉其他人，并在 Twitter 上标记我们 [@GetLexicon](https://twitter.com/GetLexicon)。

如果您使用 Lexicon 构建了应用程序，请告诉我们。我们很乐意帮助您分享您所构建的内容！

## 改进文档 {#improve-the-documentation}

最后，如果您发现 Lexicon 文档中有任何问题，或者认为您可以做得更好，您可以按照以下简要说明开始。

在项目的根目录下，运行以下命令可以在本地生成并查看文档：

```sh
npm run docs:start
```

类似地，您可以使用以下命令仅构建文档：

```sh
npm run docs:build
```

所有文档都在 `documentation/` 目录下，用于生成本站的 Markdown 页面位于 `documentation/docs` 下。

如果您最终提交了 PR 来改进文档，请确保为您的 PR 添加 `Documentation` 标签。

:::note
如果你还有其他问题，快来问我们。我们很高兴能提供些帮助。 :smile:
:::
