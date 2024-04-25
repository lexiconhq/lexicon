---
title: 配置 Discourse 站点
---

要想正常配置 Lexicon，你需要先运行一个 **[Discourse](https://www.discourse.org/)** 站点，以便 Lexicon 可以与之交互。

为了完成这一步，你有几个选择：

#### 选项 1：配置本地 Discourse 站点 {#option-1-setup-a-local-discourse-instance}

第一种选择是在你的开发机器上[设置一个开发实例](#setup-discourse-locally)。这需要一些时间，可能会有一些技术难度。

#### 选项 2：购买 Discourse 站点或使用现有站点 {#option-2-buy-a-discourse-instance-or-use-your-existing-one}

第二种选择是[在云上设置一个 Discourse 实例](#setup-discourse-in-the-cloud)作为一个实时、可访问的生产版本。这样做要简单得多，但显然需要花钱。

如果你已经有一个 Discourse 站点，那就直接使用它吧。

#### 选项 3：使用公开的 Discourse 站点 {#option-3-use-a-public-discourse-site}

第三种选择是使用现有的 Discourse 站点来测试一下。

正如你后面会看到的，Lexicon 允许你配置指向哪个 Discourse 站点。因此，你可以指示它指向一个你没有实际拥有的公开可访问的 Discourse 站点。

这样做的好处是，你可以在不费力气的情况下就立即开始使用 Lexicon。

##### Discourse Meta {#discourse-meta}

[https://meta.discourse.org/](https://meta.discourse.org/)

##### Expo {#expo}

[https://forums.expo.dev/](https://forums.expo.dev/)

##### The Rust Programming Language {#the-rust-programming-language}

[https://users.rust-lang.org/](https://users.rust-lang.org/)

##### FreeCodeCamp Forums {#freecodecamp-forums}

[https://forum.freecodecamp.org/](https://forum.freecodecamp.org/)

## 在本地配置 Discourse {#setup-discourse-locally}

:::note
这一小节可能会花费很长时间。根据你的机器配置，可能需要 10 - 30 分钟才能完成。
:::

本教程的这一部分基于 Discourse 论坛上的这篇帖子：[Beginners Guide to Install Discourse for Development using Docker](https://meta.discourse.org/t/beginners-guide-to-install-discourse-for-development-using-docker/102009)。

如果你遇到任何问题，可以参考原帖和后续讨论。

### 安装 Docker {#install-docker}

**[Docker](https://www.docker.com/)** 是一个容器化框架，它使得构建、管理和部署应用程序堆栈变得更加简单、更加安全、更加可靠，并且可以在多个平台上重复使用。

在本地开发、构建和测试应用程序时，Docker 是一个非常有价值的工具，它极大地简化了整个过程。

在本教程中，Docker 的主要作用是不需要对我们的机器环境进行任何修改，只需安装 Docker 本身即可。

这与需要在物理机器上安装 Discourse 的所有依赖项不同，后者可能需要花费大量的精力才能在以后撤消。

如果你不确定如何安装 Docker，可以按照他们的[网站](https://www.docker.com/get-started)上的说明进行操作。

### 克隆 Discourse {#clone-discourse}

Docker 运行起来后，我们就可以开始在本地设置 Discourse。

首先，我们需要将 Discourse 仓库克隆到本地机器上，并进入该目录。

```
git clone https://github.com/discourse/discourse.git
cd discourse
```

请注意，该仓库较大（将近 400MB），因此这一步可能需要一些时间，具体取决于你的网络连接。

### 拉取、构建并启动 Discourse 开发容器 {#pull-build-and-start-the-discourse-dev-container}

:::caution
请确保以下列出的<u>**主机端口**</u>在你的设备上没有被其他进程占用。
:::

Discourse 已经包含了一个脚本，可以帮助使用 Docker 启动整个基础设施。

在这个过程中，脚本将执行以下操作：

- 从 Docker 下载必要的 "dev" 镜像来引导 Discourse
- 构建上述提到的镜像
- 将镜像作为容器运行，将多个端口从主机映射到容器中的端口
  - 127.0.0.1:**1080**->1080/tcp
  - 127.0.0.1:**3000**->3000/tcp
  - 127.0.0.1:**4200**->4200/tcp
  - 127.0.0.1:**9292**->9292/tcp
  - 127.0.0.1:**9405**->9405/tcp
- 提示你输入管理员电子邮件地址和密码

要开始，请运行以下命令：

```
$ d/boot_dev --init
```

请注意，所有 Docker 镜像的磁盘空间使用量大约为 1GB。

这个命令将在你的终端会话中产生大量输出。在需要你提供相关信息时，输出会暂停。

```bash
# Output omitted
== 20200804144550 AddTitleToPolls: migrating ==================================
-- add_column(:polls, :title, :string)
   -> 0.0014s
== 20200804144550 AddTitleToPolls: migrated (0.0021s) =========================

Creating admin user...
Email:  me@me.com
Password:
Repeat password:

Ensuring account is active!

Account created successfully with username me
```

随后，它会询问你是否要将此帐户设置为管理员帐户。你需要。

```bash
Do you want to grant Admin privileges to this account? (Y/n)  y

Your account now has Admin privileges!
```

请再次注意，如上所述，上述端口目前没有被其他进程使用。

### 如果发生了意外情况 {#if-something-unexpected-happened}

在这一步可能发生了一些奇怪的事情。

也许会出现奇怪的错误消息，或者进程根本没有显示上面显示的输出。

我们建议你执行以下操作：

#### 检查是否有名为 `discourse_dev` 的 Docker 容器正在运行 {#check-if-a-docker-container-named-discourse_dev-is-running}

```bash
$ docker ps | grep discourse_dev
CONTAINER ID   IMAGE                            ...     NAMES
dc72a4ead10f   discourse/discourse_dev:release  ...     discourse_dev
```

如果有，请停止并删除容器。

```bash
$ docker stop discourse_dev
discourse_dev
$ docker rm discourse_dev
discourse_dev
```

#### 退出或杀死现有进程 {#exit-or-kill-the-existing-process}

如果现有进程（`d/boot_dev --init`）仍在占用你的终端会话，请尝试通过 `Ctrl + C` 退出。

如果进程在一段时间后仍未响应 `Ctrl + C`，请找到其 PID 并使用 `kill -9` 杀死它。

```bash
$ ps aux | grep rails
user 81254  0.0  0.1 <truncated> discourse_dev bin/rails s

$ kill -9 81254
```

#### 重启 Docker 或你的机器 {#restart-docker-or-your-machine}

使用与你设备匹配的命令或接口，重启所有 Docker。

在 Docker for Mac 上，只需点击托盘图标，然后点击 Restart。

#### 再次运行命令 {#run-the-command-again}

有时候这种设置会出现一些小问题。再次运行命令，看看这次是否更顺利。

### 如果你完全卡住了，请联系我们 {#if-youre-absolutely-stuck-reach-out}

如果你完全卡住了，或者遇到了一些奇怪的问题，我们会很乐意帮助你。

### 可选：在后台运行接下来的两个命令 {#optional-run-the-next-two-commands-in-the-background}

你可以继续阅读了解这两个命令是什么。如果你希望它们同时运行，可以通过将这两个进程放到后台来实现这一点。

这意味着它们不会占用你当前的会话，不需要你退出它们才能输入其他命令。

当你运行这个命令时，它会显示被放到后台的进程的进程 ID（PID）。

为了将它们重新放到前台，你可以运行 `fg` 命令，然后使用 `Ctrl + C` 或类似的信号来停止它们。

```bash
d/rails s & d/ember-cli &
[2] 59786
[3] 59787

fg
```

只需注意，你看不到命令的输出，因此可能需要耐心等待几分钟，等到 Discourse 在其本地地址上可访问。

或者，你可以使用这些 PID 在另一个会话中直接杀死此进程：

```bash
kill -9 59786 59787
```

### 在容器中启动 Rails 服务器 {#start-the-rails-server-within-the-container}

如果你还没有注意到，Discourse 是使用非常流行的 Web 框架 [Ruby on Rails](https://rubyonrails.org/) 构建的。

通过运行以下命令，你将启动 Rails 服务器，这需要一些时间，并会产生大量的输出。

特别是，你会看到数据库在 dev 容器引导 Discourse 服务器时被初始化。

运行以下命令即可开始。

```
d/rails s
```

#### 如果你在之后的操作中无法退出进程 {#if-you-later-cant-quit-the-process}

**注意**，有时候当你试图用 `Ctrl + C` 杀死进程时，这个命令会卡住。

如果发生这种情况，建议你首先停止 Docker 容器：

```bash
docker stop docker_dev
```

然后，如果必要，使用 `fg` 将进程带到前台。

最后，要么退出你的会话（如果可能的话，比如关闭终端），要么找到 Rails 进程的 PID 并直接杀死它。

```bash
$ ps aux | grep rails
user 81254  0.0  0.1 <truncated> discourse_dev bin/rails s

$ kill -9 81254
```

### 在容器中运行 Ember CLI {#run-the-ember-cli}

上面的部分提到了 Ruby on Rails，它处理 Discourse 应用程序的后端方面。

Discourse 前端是使用 [EmberJS](https://emberjs.com/) 构建的，这是一个由多家大公司使用的全功能前端 Web 框架。

运行以下命令，指示 Ember CLI 启动 Discourse 前端。

```
d/ember-cli
```

启动之后你可以在 [http://localhost:4200](http://localhost:4200) 访问 Discourse。

请注意，此命令的输出可能会有点令人困惑。有时候，看起来好像什么都没有发生。

在服务器准备就绪之前，你可能会看到几个进度指示器，以及几分钟后的空白输出。

输出可能会类似于以下内容：

```bash
Build successful (72475ms) – Serving on http://localhost:4200/

Slowest Nodes (totalTime >= 5%)                                       | Total (avg)
----------------------------------------------------------------------+------------------
Babel: discourse (2)                                                  | 31501ms (15750 ms)
ember-auto-import-analyzer (11)                                       | 10418ms (947 ms)
Bundler (1)                                                           | 6119ms
Babel: @ember/test-helpers (2)                                        | 5075ms (2537 ms)
broccoli-persistent-filter:TemplateCompiler (3)                       | 4596ms (1532 ms)
```

## 在云上配置 Discourse {#setup-discourse-in-the-cloud}

网络上有很多指南，指导你如何在云上设置 Discourse。

我们不想再写一篇，我们已经找到了我们最喜欢的一篇，分享给你，里面包含了完整的配置步骤。

### 由 SSDNodes 提供的指南 {#guide-by-ssdnodes}

这篇指南由 [SSDNodes](https://www.ssdnodes.com/?e=blog&q=more-about-ssdnodes) 博客提供，[Serverwise](https://blog.ssdnodes.com/blog/)。

如果你不熟悉，[SSDNodes](https://www.ssdnodes.com) 是一个优秀的、性价比高的 VPS 主机提供商。

虽然我们最熟悉 Digital Ocean，但我们强烈建议你查看他们作为 Discourse 托管的替代方案。

这篇文章的标题是 [How To Install Discourse On Ubuntu](https://blog.ssdnodes.com/blog/install-discourse/)，作者是 [Joel Hans](https://blog.ssdnodes.com/blog/author/joel/)。

Joel 写了一篇很棒的指南。他会带你完成整个过程，包括对 Discourse 实例进行更新。

如果你遇到任何问题，或者有任何疑问，欢迎联系我们。

## 使用公开的 Discourse 站点 {#use-a-public-discourse-site}

如果你选择使用公开的 Discourse 站点，你可以在 Lexicon 的设置中输入一个 URL，指向你想要使用的站点。

做完这些之后，你就可以继续下一节了。
