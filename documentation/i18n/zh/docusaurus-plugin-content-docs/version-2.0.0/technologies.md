---
title: 技术路线
---

### 100% 使用 React Native 和 TypeScript 在 Expo 构建 {#100-react-native-and-typescript-built-on-expo}

Lexicon 是使用单一代码库构建和维护的，这意味着大部分情况下的 bug 修复、改进和新功能都会自动应用于 iOS 和 Android。

### 基于 GraphQL 的 API {#graphql-based-api}

希望为 Lexicon 提交贡献或者二次开发的开发者也可以利用好 GraphQL 的所有优势。更多信息请查看[概念和架构](concepts#prose-discourse-through-graphql)。

### 白标支持 {#white-labeling-support}

通过白标功能，您可以使 Lexicon 移动应用程序具有您品牌的熟悉外观和体验。了解更多信息请参阅[白标](white-labeling)。

### 与现有 Discourse 站点轻松集成 {#painless-integration-with-existing-discourse-instances}

只需为 Prose GraphQL API 启动一个新服务器，并将其指向您的 Discourse 站点，即可轻松入门。您的 Discourse 站点本身不需要进行任何更改。

注意：要启用诸如[推送通知](./push-notifications)和[电子邮件深度链接](./email-deep-linking/intro.md)等功能，您可以安装我们的[Discourse 插件](./discourse-plugin.md)。
