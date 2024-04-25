---
title: 配置 Prose GraphQL API
---

现在有了一个运行中的 Discourse 实例可以交互，我们可以继续设置 Prose GraphQL 服务器。

回顾一下，Prose 是 Lexicon Stack 的一部分。

它负责在 Discourse 之上提供一个 [GraphQL](https://graphql.org/) 接口，Lexicon 移动应用可以与之交互。

想要了解更多信息，请查看 [概念和架构](../concepts)。

## 设置 Prose 的方法 {#approaches-for-setting-up-prose}

如果你的 Discourse 实例正在本地运行，那么你应该也在本地设置 Prose 服务器。

否则，让远程的 Prose 服务器与本地的 Discourse 服务器通信将是不必要的额外工作。

不过，如果你已经在云中设置了 Discourse 实例，那么你可以选择在本地或云中运行 Prose 服务器。

如果你想在云中安装它，你需要设置一个额外的服务器 - 类似于设置 Discourse 的方式。如果你还不熟悉这个过程，可以回到页面 [设置云服务器（可选）](setup-cloud-server)。

当然无论你选择在哪里托管 Prose，你都应该考虑如何在该机器上安装它。

第一种方法，我们推荐使用 **[Docker](https://www.docker.com/)**。

当然另一种方法是手动安装，而不是使用容器。

## 使用 Docker 安装 Prose {#install-prose-using-docker}

我们推荐使用 Docker 的原因是因为你不必担心如何在你的机器上配置 Prose。

我们已经将 Prose 发布到了 [Docker Hub](https://hub.docker.com/)，这意味着你可以轻松地拉取它并运行它。我们将在下面指导你如何操作。

### 安装 Docker {#install-docker}

首先，就像设置 Discourse 一样，你需要确保 Docker 已经安装在你的机器上。

如果你不确定如何操作，可以查看 [Docker 安装页面](https://www.docker.com/get-started) 上的说明。

### 拉取并运行 Prose GraphQL API 镜像 {#pull-and-run-the-prose-graphql-api-image}

成功安装 Docker 后，你可以使用下面的命令运行 Prose GraphQL 镜像。

只需记住在运行命令之前，根据你的环境调整一些 **环境变量*。

```
$ docker run -d \
  -e PROSE_DISCOURSE_HOST=https://meta.discourse.org \
  -e PROSE_APP_PORT=80 \
  -p 5000:80 \
  --name prose-graphql \
  kodefox/prose
```

上面的命令将负责拉取 Prose GraphQL Docker 镜像、构建它并在容器中运行它。

为了帮助你理解指令，让我们逐行分解。

```bash
docker run -d
```

这个命令告诉 Docker 以 **detached mode** 运行我们的镜像。这类似于将一个进程放到后台。

```bash
-e PROSE_DISCOURSE_HOST=https://meta.discourse.org
-e PROSE_APP_PORT=80
```

`-e` 标志告诉 Docker 我们想要在容器中设置或覆盖某些环境变量的值。

在这种情况下，我们告诉 Prose 与运行在 `https://meta.discourse.org` 的 Discourse 实例进行交互，并且 Prose 应该在容器内部的 `80` 端口上运行。

```
-p 5000:80
```

接下来，我们告诉 Docker 我们想要将主机上的哪些端口映射到容器中。

前一步中，我们已经确定 Prose 将在内部的 `80` 端口上运行。通过上面的命令，我们告诉 Docker 将容器的 `80` 端口映射到主机的 `5000` 端口上。

这意味着 Prose 将在主机的 `5000` 端口上可访问。

所以，如果你在本地运行这个命令，你可以在 `http://localhost:5000` 上与 Prose 交互。

如果你在云上运行它，比如在一个域名为 `https://prose.mydiscussions.com` 的域上，你可能希望它监听 `443` 端口，这样用户就不必在 URL 中输入端口号。

### 配置 Prose {#configure-prose}

如上所述，你可以通过环境变量配置 Prose。

你可以在 Prose [环境变量](../env-prose) 页面找到所有环境变量的详细列表。

在这种情况下，你只需要为 `PROSE_DISCOURSE_HOST` 设置一个值，这将告诉 Prose 与哪个 Discourse 实例进行交互。

除此之外，如果你想设置不同的端口映射，你可以调整 `docker run` 命令的 `-p` 标志为其他值，比如：

```bash
-p 8080:80
```

## 手动安装 {#install-manually}

这一部分，无论是在本地还是远程云服务商上，都需要你安装和配置必要的依赖项来从头开始构建和运行 Prose。

### 配置开发设备

如果你还没有给 Prose 配置好开发设备，可以按照 [设置开发设备](setup) 页面的指导进行操作。

完成之后，你将在开发设备上有一个本地的 Lexicon 仓库副本。

### 配置环境变量 {#configure-environment-variables}

Prose GraphQL API 至少需要你提供一个可访问的 Discourse 实例的 URL 才能正常运行。

因为我们是手动操作，你需要用另一种方式指定，而不是像在 Docker 中那样。

稍后构建了 Prose 之后，在启动服务器时可以直接提供此 URL。

```bash
PROSE_DISCOURSE_HOST=https://discourse.mysite.com node lib/index.js
```

不过，你可能会发现使用我们为 `.env` 文件设置的支持更合理一些。

切换到仓库的 `api/` 目录，整个 Prose 代码库都在这个目录中。

```
$ cd api/
```

接下来，你需要创建一个 `.env` 文件。只需使用以下命令将模板文件 `.env.example` 复制到 `.env` 文件中。

```
$ cp .env.example .env
```

之后，如你所料，你需要调整 `.env` 文件，使其包含特定于你的项目的值。

```bash
PROSE_DISCOURSE_HOST=<Valid URL to your Discourse instance>
PROSE_APP_PORT=<Desired port number to listen on>
```

正如我们在 Docker 部分中所述，你可以在 [Prose 环境变量](../env-prose) 页面找到所有环境变量的详细列表。

### 启动 Prose GraphQL API {#launch-the-prose-graphql-api}

:::info
此时你应该已经安装了项目的依赖。

如果你遇到任何关于缺少包的错误，请返回到 [配置开发设备](setup) 页面查看指导。
:::

如果你只是想快速启动 Prose 来查看一下，只需从 `api/` 目录运行：

```bash
$ npm run dev
```

这将准备并启动 Prose，但这种方式并不适合生产环境。

有很多方法可以在后台启动一个进程运行 Prose GraphQL API。

一种是使用 **[Tmux](https://github.com/tmux/tmux)**, 它可以将进程从终端中分离出来，让你在关闭它的情况下但保持 Prose 运行。

另一种方法是使用 **[PM2](https://pm2.keymetrics.io/)**，这是一个用于在生产环境中运行 Node 进程的复杂工具集。

#### 使用 Tmux {#using-tmux}

**Tmux** 可以将进程从其控制终端中分离出来，使会话保持活动状态而不可见。

要开始，需要在你的机器上安装 `tmux`。

如果你不确定如何安装 tmux，可以查看 [此页面](https://github.com/tmux/tmux#installation).

安装完成后，可以按如下方式启动它：

```bash
$ tmux
```

然后用以下命令启动 Prose。

```bash
$ npm run dev
```

如果你想从当前会话中分离，按下 `Ctrl + B` 然后按下键盘上的 `d` 键。会话将保持在后台运行。

如果你想重新连接到你的上一个会话，运行以下命令。

```
$ tmux a
```

如果你想了解更多关于 tmux 命令的信息，可以查看 [这个速查表](https://tmuxcheatsheet.com/)。

#### 使用 PM2 {#using-pm2}

另一种在后台运行 Prose 的方法是使用 **pm2**（NodeJS 的进程管理器）。

首先，你应该已经猜到需要在你的机器上安装 `pm2`。

```
$ npm install -g pm2
```

安装之后，你还需要使用 `pm2` 安装 [Typescript](https://typescriptlang.org/)。

这是因为 Prose 是用 Typescript 编写的，这使得 PM2 可以直接运行这些 Typescript 文件（而不是先将它们转译并输出为 JS）。

要做到这一点，只需运行以下命令：

```
$ pm2 install typescript
```

之后，你可以在后台启动 Prose GraphQL API。

```
$ pm2 start src/index.ts
```

要列出所有正在运行的应用程序，运行以下命令。

```
$ pm2 list
```

这还有一些常用的命令。

```
$ pm2 stop     <app_name|namespace|id|'all'|json_conf> # To stop a process
$ pm2 restart  <app_name|namespace|id|'all'|json_conf> # To restart a process
$ pm2 delete   <app_name|namespace|id|'all'|json_conf> # To delete a process
```

## 测试 GraphQL API {#test-the-graphql-api}

现在你已经成功启动了 Prose，你可以在你的 Web 浏览器中与它交互。

我们在构建 Prose 时使用了一些库，它自带了 [GraphiQL](https://www.graphql-yoga.com/docs/features/graphiql)。

这是一个在浏览器中运行的 GraphQL IDE，使得探索 GraphQL API 的文档和模式变得容易。

为了访问它，你需要记下你配置 API 的主机和端口号。

例如，如果你在本地机器上的端口 `5000` 上启动了 Prose，你可以在浏览器中输入 [http://localhost:5000](http://localhost:5000)。

同样，如果你在云上设置了它，并且只有一个 IP 地址，Prose 在端口 `80` 上监听，你可以在浏览器中输入 [http://174.31.92.1](http://174.31.92.1).

GraphiQL 加载好之后，你可以测试一些示例查询和变更，包括通过 Prose 登录 Discourse。

### 登陆 {#login}

:::info
如果你正在访问一个私有的 Discourse 站点，你需要记下返回的令牌以进行其他请求。请参见下面。
:::

```
mutation Login {
  login(email: "user@lexicon.com", password: "user_password") {
    ... on LoginOutput {
      token
      user {
        id
        name
        username
        avatarTemplate
      }
    }
  }
}
```

正如上面的通知所提到的，如果你正在与一个私有的 Discourse 站点交互，你需要为其他 GraphQL 请求提供一个令牌。

这个令牌是在上面的登录请求的响应中的 Base64 编码的值。

你可以在页面的左侧打开 HTTP Headers 部分，这部分需要 JSON，你需要添加一个包含你的令牌的 Authorization 头

```json
{
  "Authorization": "<token>"
}
```

做完之后，你可以使用登录请求的响应中的用户信息进行其他请求。

### 用户配置 {#user-profile}

```
  query UserProfile {
    userProfile(username: "john_doe") {
      user {
        ... on UserDetail {
          id
          avatarTemplate
          username
          name
          websiteName
          bioRaw
          location
          dateOfBirth
          email
        }
      }
    }
  }
```

### 主题细节 {#topic-detail}

```
query TopicDetail {
  topicDetail(topicId: 1) {
    id
    title
    views
    likeCount
    postsCount
    liked
    categoryId
    tags
    createdAt
    postStream {
      posts {
        id
        topicId
        userId
        name
        username
        avatarTemplate
        raw
        createdAt
      }
      stream
    }
    details {
      participants {
        id
        username
        avatarTemplate
      }
    }
  }
}
```

### 退出登陆 {#logout}

```
  mutation Logout {
    logout (username: "john_doe")
  }
```
