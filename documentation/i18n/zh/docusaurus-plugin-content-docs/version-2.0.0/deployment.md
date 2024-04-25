---
title: 概览
---

正如[概念和架构](concepts#prose-discourse-through-graphql)中所介绍的，Prose是Lexicon的GraphQL API层，位于Discourse提供的传统RESTful API之上。

## 开始部署 {#getting-started-with-deployment}

在这一点上，您可能会因以下两个原因而深入研究本文档的这一部分：

- 您一直在针对运行Prose的本地实例（或容器）进行开发，现在准备将整个Lexicon项目部署到生产环境。
- 您希望简化开发流程，将Lexicon移动应用程序指向部署的Prose实例。

无论哪种情况，本节的最终目标是在公开互联网上访问一个可用的Prose服务器。

### 🔐 关于访问控制的说明 {#-note-about-access-control

这里提一下，Prose 无法暴露 Discourse 未公开的任何信息。

如果您的 Discourse 实例需要身份验证，则 Prose 将无法检索大多数查询，除非访问 Prose 的用户提供所需的身份验证信息。


### 🧱 备选部署策略 {#-alternative-deployment-strategies}

最初，我们希望提供一个集成部署策略的说明。这将涉及在与您的 Discourse 实例相同的主机上部署 Prose，并最好找到一种方法在 Discourse 使用的 Docker 主机内部部署和公开它。

这是可以实现的。但是我们选择专注于仅部署 Prose 作为专用实例。

不过我们也鼓励您自定义部署 Prose。

如果您选择这样做，并且遇到一些问题或挑战，请与我们联系。

理想情况下，我们可以帮助您解决问题，并将您的方法整合到我们的文档中，以便更多人从中受益。

## 部署为专用实例 {#deploying-as-dedicated-instance}

如上所述，Prose 的官方部署策略是将其部署为专用实例。

这种方式同世间其他万物一样也有两面性，如下：

### 🚀 优势 {#-benefits}

Prose 的专用主机将具有更好的性能和可靠性，因为其唯一的资源使用来自运行 Prose。即，它有独占的 CPU、RAM、磁盘空间等。

另一方面，如果您设法将 Prose 部署在与运行 Discourse 实例相同的主机上，这意味着 Prose 和 Discourse 都需要共享主机分配的资源。如果您的 Discourse 实例已经在一个相当轻的主机上运行，那么在其上运行 Prose 可能意味着您需要升级到具有更多资源的主机。

### ⚠️ 可能的权衡 {#️-possible-trade-offs}

#### 成本增加 {#increased-cost}

当然，如果您设置专用主机来运行 Prose，则这将增加除了为托管 Discourse 而支付的费用的额外的成本。

话虽如此，对于大多数部署，您不太可能需要为 Prose 分配昂贵的资源。

例如，在 Digital Ocean 上，$5 的共享 CPU 节点通常就足够了。

#### 可能增加的延迟 {#potential-for-increased-latency}

自然地，将 Prose 部署在与运行 Discourse 实例的不同主机上，会增加移动应用程序与 Discourse 之间的延迟。

这是因为每个请求都需要进行两次跳转：

- 第一个请求是从客户端（您的 Lexicon 驱动的移动应用程序）到 Prose GraphQL API
- 第二个请求是从 Prose 到 Discourse

然而，关于这一点最重要的问题是：

- 量化具体有多少的延迟？
- 这个延迟对我或我的用户来说是否明显缓慢？

当然，这取决于几个因素：

- 您的 Discourse 服务器部署在哪里
- 您的 Prose 服务器部署在哪里
- 您的用户主要于在哪里
- 如果流量（负载）对系统来说太多，无法使 Prose 和 Discourse 以最佳方式运行。

如果您观察到明显的延迟，我们建议您查看这些因素。

理想情况下，您将希望将 Prose 部署在与 Discourse 实例相同的区域；如果可以将 Prose 部署在与 Discourse 实例相同的数据中心，则更好。

## 接下来 {#up-next}

有了这个概述，我们将首先向您介绍可能在部署 Prose 时可能需要或有用的所有[环境变量](env-prose)的列表。

最后，我们将深入其中，通过[准备您的主机和部署 Prose](dedicated)。
