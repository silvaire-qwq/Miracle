---
title: 和我一起配置 zsh 吧
published: 2025-06-30
description: 刚装好的 Linux 终端不好看？zsh 助你一臂之力。本期教程将会教您如何配置 zsh (zinit)。
tags: [Linux, Terminal]
category: Linux
---

## 安装
你可以使用你的系统自带的包管理器安装 zsh，例如我是 Arch Linux，就可以输入这个来安装：
```bash
sudo pacman -S zsh
```
刚安装好的是一个空壳，别着急，继续往下看。

## 安装插件管理器 (zinit)
你可以在你的 `~/.zshrc` 文件中加入以下内容：
```bash
autoload -Uz compinit
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit
compinit -D

if [[ ! -f $HOME/.local/share/zinit/zinit.git/zinit.zsh ]]; then
    print -P "%F{33} %F{220}Installing %F{33}ZDHARMA-CONTINUUM%F{220} Initiative Plugin Manager (%F{33}zdharma-continuum/zinit%F{220})…%f"
    command mkdir -p "$HOME/.local/share/zinit"
        command chmod g-rwX "$HOME/.local/share/zinit"
    command git clone https://github.com/zdharma-continuum/zinit "$HOME/.local/share/zinit/zinit.git" && \
        print -P "%F{33} %F{34}Installation successful.%f%b" || \
        print -P "%F{160} The clone has failed.%f%b"
fi

source "$HOME/.local/share/zinit/zinit.git/zinit.zsh"
```
然后重新读取一下配置文件：
```bash
source ~/.zshrc
```

### 安装插件
由于一个一个添加有点麻烦，所以我这里提供了一段代码：
```bash
for zinit_temp ("${LIGHT[@]}") {
    zinit light "$zinit_temp"
}
unset zinit_temp
```
后面再加入插件只需要加到 `LIGHT` 中就可以了：
> [!WARNING]
> 下面的东西必须放在上面的代码的前面，不然无法加载。
```bash
local LIGHT=(
    xxx/xxx
    xxx/xxx
    xxx/xxx
    ...
)
```
推荐一些插件，是我自己正在用的：
```bash
local LIGHT=(
    zdharma-continuum/history-search-multi-word
    zsh-users/zsh-autosuggestions
    zdharma-continuum/fast-syntax-highlighting
    zsh-users/zsh-syntax-highlighting
    zsh-users/zsh-completions
    zsh-users/zsh-history-substring-search
    ael-code/zsh-colored-man-pages
)
```

### 从 `OMZ` 中加载库
同上，加入：
```bash
for zinit_omz_temp ("${LIB_FROM_OMZ[@]}") {
    zinit snippet OMZ::lib/"$zinit_omz_temp".zsh
}
unset zinit_omz_temp
```

> [!WARNING]
> 同上，下面的东西必须放在上面的代码的前面，不然无法加载。这些内容我都已经写好了，如果想自行配置，可以删除这些内容，自行添加。如果到现在还不清楚要写在哪里，请参考下方的“核对文件”部分。
```bash
local LIB_FROM_OMZ=(
    async_prompt
    git
    grep
    clipboard
    completion
    history
    key-bindings
    theme-and-appearance
    prompt_info_functions
    directories
)
```

### 核对文件
现在你的文件应该是这样的：
```bash
local LIGHT=(
    zdharma-continuum/history-search-multi-word
    zsh-users/zsh-autosuggestions
    zdharma-continuum/fast-syntax-highlighting
    zsh-users/zsh-syntax-highlighting
    zsh-users/zsh-completions
    zsh-users/zsh-history-substring-search
    ael-code/zsh-colored-man-pages
)

local LIB_FROM_OMZ=(
    async_prompt
    git
    grep
    clipboard
    completion
    history
    key-bindings
    theme-and-appearance
    prompt_info_functions
    directories
)

autoload -Uz compinit
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit
compinit -D

if [[ ! -f $HOME/.local/share/zinit/zinit.git/zinit.zsh ]]; then
    print -P "%F{33} %F{220}Installing %F{33}ZDHARMA-CONTINUUM%F{220} Initiative Plugin Manager (%F{33}zdharma-continuum/zinit%F{220})…%f"
    command mkdir -p "$HOME/.local/share/zinit"
        command chmod g-rwX "$HOME/.local/share/zinit"
    command git clone https://github.com/zdharma-continuum/zinit "$HOME/.local/share/zinit/zinit.git" && \
        print -P "%F{33} %F{34}Installation successful.%f%b" || \
        print -P "%F{160} The clone has failed.%f%b"
fi

source "$HOME/.local/share/zinit/zinit.git/zinit.zsh"

for zinit_temp ("${LIGHT[@]}") {
    zinit light "$zinit_temp"
}
unset zinit_temp

for zinit_omz_temp ("${LIB_FROM_OMZ[@]}") {
    zinit snippet OMZ::lib/"$zinit_omz_temp".zsh
}
unset zinit_omz_temp
```
当你再次进入 `zsh` 时，就会安装这些插件，然后你就……发现缺少了点什么？为什么我们的终端还是这么简陋啊喂！

## Prompt / 提示符
是的，你觉得简陋的原因就是我们还没有配置 Prompt。
```
Archlinux%
```
这应该就是你现在的样子。等等，看了这么多教程的你，是不是以为又要装 powerlevel10k 了？这次来点不一样的。
### 安装 `starship`
如果你是 Arch Linux 用户，你可以直接用 `pacman` 安装它：
```bash
sudo pacman -S starship
```
如果你不是，请用这个命令安装：
```bash
curl -sS https://starship.rs/install.sh | sh
```
然后再在 `~/.zshrc` 里添加这个来加载它：
```bash
eval "$(starship init zsh)"
```
好了，你的终端变得好看了一点。如果你不满意这个提示符，可以去[官网](https://starship.rs/zh-CN/presets/)找到其他的主题。

## 参考文件
```bash
local LIGHT=(
    zdharma-continuum/history-search-multi-word
    zsh-users/zsh-autosuggestions
    zdharma-continuum/fast-syntax-highlighting
    zsh-users/zsh-syntax-highlighting
    zsh-users/zsh-completions
    zsh-users/zsh-history-substring-search
    ael-code/zsh-colored-man-pages
)

local LIB_FROM_OMZ=(
    async_prompt
    git
    grep
    clipboard
    completion
    history
    key-bindings
    theme-and-appearance
    prompt_info_functions
    directories
)

autoload -Uz compinit
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit
compinit -D

if [[ ! -f $HOME/.local/share/zinit/zinit.git/zinit.zsh ]]; then
    print -P "%F{33} %F{220}Installing %F{33}ZDHARMA-CONTINUUM%F{220} Initiative Plugin Manager (%F{33}zdharma-continuum/zinit%F{220})…%f"
    command mkdir -p "$HOME/.local/share/zinit"
        command chmod g-rwX "$HOME/.local/share/zinit"
    command git clone https://github.com/zdharma-continuum/zinit "$HOME/.local/share/zinit/zinit.git" && \
        print -P "%F{33} %F{34}Installation successful.%f%b" || \
        print -P "%F{160} The clone has failed.%f%b"
fi

source "$HOME/.local/share/zinit/zinit.git/zinit.zsh"

for zinit_temp ("${LIGHT[@]}") {
    zinit light "$zinit_temp"
}
unset zinit_temp

for zinit_omz_temp ("${LIB_FROM_OMZ[@]}") {
    zinit snippet OMZ::lib/"$zinit_omz_temp".zsh
}
unset zinit_omz_temp

eval "$(starship init zsh)"
```