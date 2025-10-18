---
title: Arch Linux 是什么？
published: 2025-09-03
description: Arch Linux 是一种通用操作系统，它是基于 x86-64 架构的一类 GNU/Linux 发行版。
tags: [Arch, Linux]
category: Linux
origin: "https://wiki.archlinuxcn.org/wiki/Arch_Linux"
---

Arch Linux 是一种通用操作系统，它是基于 x86-64 架构的一类 GNU/Linux 发行版。

Arch Linux 采用滚动升级模式，尽全力为使用者提供最新的稳定版软件。初始安装完成的 Arch Linux 只是一个基本系统，随后用户可以根据自己的喜好安装需要的软件并配置成符合自己理想的个性化系统。

## 核心原则

以下核心原则构成了我们通常所指的 Arch 之道，或者说 Arch 的哲学。或许最好的结词是 Keep It Simple, Stupid（对应中文为“保持简单，且一目了然”）。

### 简洁

Arch Linux 将简洁定义为：**避免任何不必要的添加、修改和复杂化的增加**。它提供的软件包都来自原始开发者（以下简称上游），且仅进行和本发行版（以下简称下游）相关的最小修改版本。

- 不包含上游不愿意接受的补丁。绝大部分 Arch 下游补丁都已经被上游接受，会在下一个正式版本里被包含。
- 配置文件也是来自上游，它仅包含发行版必须的调整，比如特殊的文件系统路径变动。Arch Linux 不会在安装一个软件包后就自动启动软件包的服务。
- 软件包通常都和一个上游项目直接对应。仅在极少数情况下才会拆分软件包。
- 官方不支持图形化配置界面，建议用户使用命令行或文本编辑器修改设置。

### 现代化

Arch Linux 尽全力使软件处于最新的稳定版本，只要没有出现系统软件包损坏，都会尽量使用最新版本的软件包。

Arch Linux 采用滚动更新的方式，安装之后可以通过命令持续更新系统与软件包。

Arch Linux 向 GNU/Linux 用户提供了许多新特性，包括 systemd 初始化系统、现代化的文件系统、LVM2/EVMS、软件磁盘阵列（软 RAID）、udev 支持、initcpio（附带 mkinitcpio）以及最新的 Linux 内核。

### 实用性

Arch Linux 注重实用性，且尽力避免意识形态之争。最终的设计决策都是由开发者之间的共识决定，开发者依赖基于客观事实的技术分析和讨论，避免国家之间和政治因素的影响，不被世俗流行观点左右。

Arch Linux 的仓库中包含大量的软件包和编译脚本。用户可以按照需要进行自由选择。仓库中既提供了开源、自由的软件，也提供了闭源软件。即**实用性大于意识形态**。

### 以用户为中心

许多 Linux 发行版都试图变得更加“用户友好”，Arch Linux 则一直是，且永远会是“**以用户为中心**”。本发行版是为了满足贡献者的需求，而不是为了吸引尽可能多的用户。

Arch Linux 适用于乐于自己动手的用户，因为他们往往更愿意花时间阅读文档，解决自己的问题。

Arch Linux 鼓励每一个用户参与和贡献，报告和帮助修复 bugs，提供软件包补丁和参加核心项目：Arch 开发者都是志愿者，通过持续的贡献成为团队中的一员。Archers 可以自行贡献软件包到 Arch 用户仓库，提升 ArchWiki 文档质量，在论坛、邮件列表或者 IRC 中给其它用户提供技术支持。

Arch Linux 现在是全球许多 GNU/Linux 用户的选择，已经有许多国际社区提供帮助和文档的翻译。

### 通用性

Arch Linux 作为一种通用 Linux 发行版，它的初始安装仅提供命令行环境：用户不需要删除大量不需要的软件包，而是可以从官方软件仓库成千上万的高质量软件包中进行选择，并搭建自己的系统。目前支持 x86-64 架构。（对 i686 架构的支持已经结束）

Arch Linux 使用 Pacman 包管理系统实现系统和软件包的滚动升级。并且 Arch Linux 还提供一个类似 ports 的包构建系统（Arch Build System），通过它可以轻松从源码构建和安装软件包，并用一个命令完成同步。您甚至可以用一个命令重新构建整个系统。Arch 还提供 Arch 用户仓库，它包含了成千上万个由用户自行维护的 PKGBUILD 脚本，配合 makepkg 工具，从编译到打包一气呵成。用户还能轻松构建和维护属于自己的自定义软件源。

## 历史沿革

这些年来，Arch 社区不断成长，最近也收到了大量的关注和评论。

除少数特例以外，Arch Linux 的开发者大部分是不收工资的志愿者与爱好者，目前也并没有通过 Arch Linux 赚钱的计划。Arch Linux 开发的详细历史可以浏览 Arch 部分和 Arch Linux 新闻存档及 Arch Linux CN 首页上的中文版新闻列表。

### 早期

加拿大程序员、吉他手 Judd Vinet 从 2001 年早期开始开发 Arch Linux ，并在 2002 年 3 月 11 日正式发行 0.1 版。他受到 Slackware、BSD、PLD Linux 和 CRUX 的启发，但在当时这些发行版普遍缺少软件包管理工具。所以 Vinet 同样以简洁为原则建立了这个发行版，并编写了 Pacman 软件包，自动处理软件包的依赖解析、安装、删除和更新。

### 中期

这个图表见证了Arch Linux 社区的稳步扩大。而且从早期开始，Arch 就树立起了**开放、友好和社区互助**的形象。

### ArchWiki 的诞生

2005 年 7 月 8 日，用 MediaWiki 搭建的 ArchWiki 开始运行。

### A. Griffin 时代

2007 年下半年，Judd Vinet 退出了 Arch Linux 的开发，并把领导权交给美国程序员 Aaron Griffin，也就是 Phrakture，目前他依然是 Arch Linux 开发者。

### Arch 安装脚本

在 2012 年 7 月的 Arch Linux 安装介质中弃用了基于菜单的"Arch 安装框架"（AIF），改为使用"Arch 安装脚本"（arch-install-scripts）。

### Systemd 时代

2012 到 2013 年间， Arch 用 Systemd 替换了 System V init。

### 抛弃 i686 支持

鉴于在开发者和社区中对 i686 架构的使用程度逐渐式微，Arch Linux 对 i686 的支持已经于2017年11月底被抛弃。

### 选举项目的领导角色

2020 年初，Arch 开始用新的流程选择未来的领袖，详情记载在 DeveloperWiki: Project Leader。

Aaron Griffin 决定不再担任项目领导，因此 Arch 通过选举方式正式确认 Levente Polyak 为新的领导。

### GitLab 时代

2023 年 5 月，Arch Linux 将其打包基础设施迁移到 GitLab。除了内部更改和创新外，这也导致将 testing 仓库拆分为 core-testing 和 extra-testing，将 staging 仓库拆分为 core-staging 和 extra-staging，最后 community 已合并至 extra。

几个月后，即 2023 年 11 月，旧的错误跟踪器（Flyspray）已迁移到 GitLab，其协作功能（问题和合并请求）已向公众开放。因为存档问题，保留一个旧错误跟踪器的静态副本，以保证链接仍然有效。
