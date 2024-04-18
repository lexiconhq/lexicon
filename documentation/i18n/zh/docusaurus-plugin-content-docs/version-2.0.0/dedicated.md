---
title: 配置与部署
---

正如[概览](deployment)中所提到的，本节旨在指导您配置和部署 Prose 到专用实例。

## 决定在哪里托管 {#decide-on-where-to-host}

首先，您需要回答以下问题。您想在哪里托管 Prose？

虽然有许多选项，这些选项因项目和开发人员的偏好而异，但通常最简单的方法是使用您选择的云服务商。

在[Lexicon 教程](tutorial/setup-cloud-server)中，我们通过使用 Digital Ocean 演示了这个过程。

如果您对此步骤感到困惑，或者没有偏好，您应该花些时间来解决这个问题。

但是，如果您已经知道自己在做什么，请随意使用您选择的任何云服务商或其他托管方案。

### 托管条件清单 {#hosting-checklist}

一旦您决定了托管方案，通过下面的清单验证一切是否按预期设置。

#### ✅ 确保主机上的访问和权限 {#-ensure-access--permissions-on-the-host}

您需要至少能够登录到主机。一些云服务商提供虚拟的基于 Web 的终端，但理想情况下，您可以直接获取登录凭据。

如果您的主机位于基于 UNIX 的环境中，您还应该具有以 `sudo` 运行命令的权限。

快速检查的方法是尝试使用 `sudo` 运行命令：

```sh
$ sudo ls
```

不过，如果您的主机环境受到限制，您只需要一种方法将 Lexicon 源放到主机上，安装其依赖项，并在端口上公开它。

请记住，受限制的托管环境并不理想，特别是因为配置教程中使用了 Docker。

#### ✅ 确保主机以您需要的方式可访问 {#-ensure-the-host-is-reachable-in-the-way-you-need-it}

通常，这意味着您的主机可以在公网上访问。

然而，您可能有不同的约束条件，例如只需要主机从 VPN 或本地网络中访问。

<br />

一旦您配置好了一个主机，可以按您需要的方式访问它，您就可以开始在其上配置 Prose。


## 配置与部署 Prose {#configure--deploy-prose}

### 不使用 Docker {#without-docker}

通常不使用 Docker 部署 Prose 意味着更多的手动步骤，可能会因平台而异。

我们已经在教程中很好地涵盖了这种方法。特别是，您可以在[设置 Prose GraphQL API](tutorial/install-prose#install-manually)页面上深入了解。

### 使用 Docker {#with-docker}

Prose Docker 镜像预先配置为使用 **[PM2](https://pm2.keymetrics.io/)** 运行 Prose，PM2 是一个用于在生产环境中运行 Node 进程的复杂工具集。

这通常是一个合理的设置，甚至可以直接将 PM2 服务器暴露给主机上的请求。

但是，如果您更喜欢不同的设置，也许使用 Nginx 作为 Docker 容器的反向代理，可以随意修改 Dockerfile 以满足您的需求。

#### 安装 Docker {#install-docker}

**[Docker](https://www.docker.com/)** 是一个容器化框架，它使构建、管理和部署应用变得更加安全、可靠和可重现。

有很多关于在给定操作系统上安装 Docker 的指南。

Ubuntu 是大多数云提供商提供的操作系统之一。

Docker 为此提供了一个[完整教程](https://docs.docker.com/engine/install/ubuntu/)，甚至提供了一个方便的脚本，您可以在两行中运行：

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

无论您选择何种方式，只需确保 Docker 在主机上运行后再继续。

#### 配置环境变量 {#configure-environment-variables}

完整的 Prose 环境变量列表可以在[环境变量](env-prose)页面上找到。

简而言之，至少您需要确保 `PROSE_DISCOURSE_HOST` 已设置。

另一个需要注意的变量是 `PROSE_APP_PORT`。默认为 80 端口，这会让 Prose 在该端口上监听。

根据您的设置，您可能希望它监听不同的端口。

<br />

#### 从 Dockerfile 构建 Prose {#build-prose-from-the-dockerfile}

如果您想使用 Docker 手动构建 Prose，请从 **项目根目录** 运行以下命令。

如果您想对 Dockerfile 进行一些调整，这可能对您有所帮助。

否则，如果您只想从 Docker Hub 拉取最新的 Prose 构建，您可以[跳到下一步](#pulling-the-prose-docker-image)。

除非您对 Dockerfile 进行了修改并将其存储在其他位置，否则可以通过运行以下命令开始构建：

```bash
docker build -t prose:latest -f api/deploy/Dockerfile api/
```

这个命令搜索 `api/deploy/Dockerfile` 中的 `Dockerfile`，因为我们使用 `-f` 标志指示它在那里查找。

然后，它使用 `api/` 作为构建的工作空间，这使得 `Dockerfile` 中的引用正确解析。

通过传递 `-t prose:latest` 标签，将本地构建的镜像标记为最新构建。这对于在 Docker 环境中识别和管理镜像非常有用。

#### 拉取 Prose Docker 镜像 {#pull-the-prose-docker-image}

如果您更愿意使用预编译好的 Prose 镜像的最新版本，只需运行：

```
docker pull kodefox/prose:latest
```

#### 运行 Prose Docker 容器 {#run-the-prose-docker-container}

接下来，要运行新构建的镜像，请运行以下命令：

```bash
docker run -d \
    -e PROSE_DISCOURSE_HOST=https://discourse.example.com \
    -e PROSE_APP_PORT=4000 \
    --name prose \
    -p 5000:4000 \
    kodefox/prose:latest
```

:::note
如果您手动构建了镜像，您需要将 `kodefox/prose:latest` 替换为您使用的镜像名称和标签，例如 `prose:latest`。
:::

小回顾一下，让我们简要地逐行解释一下这个命令。

**在 Detached 模式运行**

```bash
docker run -d
```

第一行让 Docker 知道在 **detached模式** 下运行容器。

这意味着命令将在后台运行，不会与当前会话窗口绑定，并且即使您退出也会继续运行。

如果省略 `-d` 标志，Docker 将在前台运行容器，退出前台进程将停止容器。

**设置环境变量**

```bash
-e PROSE_DISCOURSE_HOST=https://discourse.example.com
-e PROSE_APP_PORT=4000
```

这些行设置 Docker 在运行容器时将环境变量 `PROSE_DISCOURSE_HOST` 和 `PROSE_APP_PORT` 传递给容器。

这两个都是应用级环境变量，Prose 本身将使用它们来正确运行。

Docker 镜像需要这些值被设置，并将它们传递给容器的环境，然后 Prose 通过 `process.env` 访问它们。

**为容器命名**

```bash
--name prose
```

这一行告诉 Docker 为正在运行的容器命名。这使得通过命令更容易识别和与之交互，例如：

```bash
docker stop prose
```

**配置主机和容器之间的端口映射**

```bash
-p 5000:4000
```

接下来，我们配置 Docker 的端口映射，这告诉 Docker 监听主机端口 `5000` 并将其映射到容器端口 `4000`。

因为我们之前设置了 `PROSE_APP_PORT=4000`，这意味着所有对主机端口 `5000` 的请求将被转发到容器内运行的 Prose 的端口 `4000`。

```bash
kodefox/prose:latest
```

命令的最后一行告诉 Docker 使用哪个镜像来运行容器。

如果您之前手动构建了 Prose 镜像，它将是您的镜像名称和标签，例如 `prose:latest`。

如果您选择从 Docker Hub 拉取，这只是告诉 Docker 如果本地没有此镜像时从哪里拉取镜像。

#### 下一步 {#next-steps}

到此为止，您应该已经在主机上运行了 Prose 服务器的 Docker 容器。

但是，就准备将 Prose 主机部署到生产环境而言，您还没有完成。

接下来，我们将指导您完成最后几个步骤，完成 Prose GraphQL 服务器的部署。

#### 配置 SSL（重要） {#setup-ssl-important}

:::danger
部署没有 SSL 的 Prose，以一种可以公开访问的方式是**极其危险**的。

这样做可能会您的 Discourse 站点及其所有数据的完全访问权限暴露给攻击者。
:::

在这一点上，**最重要的下一步**是为您的 Prose 主机配置 SSL 证书。

这么重要的原因是，没有 SSL，Prose 与 Discourse 之间的流量是未加密的。

这意味着攻击者可以窥探您的用户设备和 Discourse 之间的请求，包括重要的身份验证信息。

直截了当地说，部署 Prose 而没有配置 SSL 是不负责任的，会危及您的 Discourse 站点的安全。

攻击者甚至可以窃取您的身份验证令牌，并使用它访问甚至破坏您的 Discourse 站点。

#### 如何设置 SSL {#how-to-setup-ssl}

有多种方法可以获得 SSL 证书。有些是免费的，有些是付费的。

免费的方法包括使用 [Let's Encrypt](https://letsencrypt.org/)，这是非常有用的，但可能需要更多的技术知识才能正确设置——取决于您的配置。一个关键的区别是您需要更频繁地更新证书。

付费的方法包括使用像 [DigiCert](https://www.digicert.com/) 这样的提供商来获得证书，这些证书的过期时间更长。

无论哪种方法，您最终都会获得证书文件，您可以配置并启动您的 Web 服务器。

理想情况下，此时您已经购买了一个域名。如果没有，我们建议使用域名提供商获取一个低成本的域名。

您可以将 Prose 托管在现有 Discourse 站点的子域上，例如 `prose.mydiscoursesite.com`。

或者，您可以只是获取一个便宜的、无意义的域名，例如 `purplemonkeydishwasher.tech`——因为您的用户通常不会看到它。

无论如何，在部署 Prose 到生产环境之前，**绝对不能**忽略准备好主机以加密 Prose 流量的重要性。

#### 确定如何在主机上公开 Prose {#determine-how-youll-expose-prose-on-the-host}

当有人导航到运行 Prose 的主机时，他们的请求将如何路由到 Prose？

如果您直接在端口 80 上公开 Prose——**不推荐**——并且您的主机的域名是 `myproseserver.com`，那么用户将导航到 `http://myproseserver.com`，并看到[GraphiQL 界面](https://www.graphql-yoga.com/docs/features/graphiql)。

然而，更常见的方法是使用专用的 Web 服务器，如 Nginx 或 Apache，作为反向代理。

通过这种方法，Web 服务器监听您告诉它的所有端口，并配置为将流量路由到运行 Prose 的主机。

我们更高度推荐这种方法的原因如下：

- 现有的 Web 服务器通常更可靠和高性能
- 它允许配置 SSL 证书，这对保护您的用户数据是必要的

在配置 Web 服务器后，您需要指示它将流量转发到运行的 Prose 服务器。

您的设置可能如下所示：

- Nginx 配置为在您的域名 `purplemonkeydishwasher.tech` 上监听端口 80 和端口 443
- Nginx 已定位并加载了您的 `purplemonkeydishwasher.tech` 的 SSL 证书文件
- Nginx 配置为将端口 80 上的所有请求重定向到端口 443
- 您的 Prose 服务器在 Docker 中运行，端口为 80，并在主机上的端口 8080 上公开
- 您的 Nginx 配置指定将 `purplemonkeydishwasher.tech` 的请求转发到端口 8080
- 向 `purplemonkeydishwasher.tech`的请求，Nginx 将其路由到运行 Prose 的容器，Prose 处理请求并响应。

#### 配置云提供商的防火墙，如果有的话 {#configure-your-cloud-providers-firewall-if-one-exists}

理想情况下，您已经配置了 Prose 以在开放互联网上公开，流量通过端口 443 加密。

但是，根据您的云提供商，您可能需要进入其设置，并在防火墙上公开该端口。

例如，在 DigitalOcean 中，这涉及到转到 Networking 部分，并创建一个新的防火墙规则。

添加常见端口，如 80 和 443，到防火墙是相当简单的。

之后，您只需将防火墙应用到您的特定实例，流量应该被允许通过。

#### 为您的域配置 DNS 设置 {#configure-dns-settings-for-your-domain}

只要您已经注册了一个域名，您需要配置它，以便域名指向运行 Prose 的主机。

根据您的设置，这可能在您的域名服务商的设置面板中完成，或者可能在您的云服务商内部完成。

继续使用上面的 DigitalOcean 示例，您可以配置您的域名服务商指向 DigitalOcean 的域名服务器。

这实际上告诉您的域名提供商，DigitalOcean 将为您处理一切，并允许您从 DigitalOcean 内部进行域的调整。

在这种情况下，DigitalOcean 使将域名无缝映射到实例的 IP 地址，然后应该可以从域名访问它。

否则，您需要获取主机的 IP 地址，进入您的域名提供商，并指示它将对域名的请求转发到主机的 IP 地址。

#### 准备就绪 {#ready-to-go}

到此为止，你的主机应该已经在正常运行 Prose 服务器了。当你访问你为 Prose 配置的域名时，你应该看到 Prose 在正常运行。

由于部署方式不同，我们理知道你的部署中有很多细节可能与此教程有较大出入。

如果在部署时遇到任何问题，请像往常一样不要犹豫联系我们寻求支持。
