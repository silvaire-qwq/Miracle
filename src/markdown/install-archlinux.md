---
title: 使用命令行安装单系统 Arch Linux
published: 2025-02-25
description: 论加入 Arch 教的第一步——安装
tags: [Arch, Linux, Terminal]
category: Linux
---

## 检查
1. 你的电脑支持 UEFI 启动。
2. 你的电脑已经关闭安全启动。
3. 你拥有 Linux 基础。
4. 好的心态 😉

> [!NOTE]
> 如果您在安装过程中遇到问题，请尝试使用搜索引擎搜索问题或者查阅 [Arch Wiki](https://wiki.archlinux.org)，最好不要询问他人。

> [!WARNING]
> 您硬盘上的所有信息将会被抹除，所以请提前备份，如出现数据丢失等情况，后果自负。

## 准备
1. 一个 [Arch Linux 镜像](https://mirrors.tuna.tsinghua.edu.cn/archlinux/iso/latest/archlinux-x86_64.iso)。
2. 使用写盘工具将镜像文件写入你的 USB。
<br>

准备好后，请从 USB 中启动您的 Arch Linux ISO。进入 Grub 引导界面选择后请第一个。

## 连网
> 这一步仅限使用 WLAN 连接网络的设备需要操作。如果你已经使用网线连接了网络，请跳过这一步。

我们可以使用 ```iwctl``` 命令连接网络。
```bash
iwctl
device list # 查看你的无线网卡名称
station wlan0 scan # 扫描网络，一般无线网卡为 wlan0
station wlan0 get-networks # 列出 Wi-Fi 列表
station wlan0 connect 你的网络名 # 连接网络
exit # 退出
```

然后，你需要测试是否已经连接网络。
```bash
ping 1.1.1.1
```
```
PING 1.1.1.1 (1.1.1.1) 56(84) bytes of data.
64 bytes from 1.1.1.1: icmp_seq=1 ttl=54 time=185 ms
64 bytes from 1.1.1.1: icmp_seq=2 ttl=54 time=184 ms
64 bytes from 1.1.1.1: icmp_seq=3 ttl=54 time=185 ms
```
出现类似以上的持续输出后可以按下 Ctrl+C 结束。

## 换源
在此之前，请先禁用 Reflector，因为 Reflector 可能会更新你的 mirrorlist 文件。
```bash
systemctl stop reflector.service
```
删掉 mirrorlist 文件。
```bash
sudo rm -rf /etc/pacman.d/mirrorlist
```
然后就可以更换了，你需要输入以下内容使用 vim 编辑器打开。
```bash
vim /etc/pacman.d/mirrorlist
```
请在此加入以下内容：
```
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```
完成后请按下 ESC 并输入 ```:wq```，回车。

## 分区

在分区之前，你需要查看你磁盘的编号。
```bash
fdisk -l
```
```
Disk /dev/nvme0n1: 476.94 GiB, 512110190592 bytes, 1000215216 sectors
Disk model: KBG50ZNV512G KIOXIA
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: gpt
Disk identifier: 0B70F9F0-7C38-4F81-9EAB-754397E6079D

Device           Start        End   Sectors   Size Type
/dev/nvme0n1p1    2048    2099199   2097152     1G EFI System
/dev/nvme0n1p2 2099200 1000214527 998115328 475.9G Linux filesystem
```
你会看到一个或者多个 Disk /dev/* 等磁盘，请查看磁盘的分区或磁盘大小来辨别你要安装的磁盘。例如我的电脑，就只有一个磁盘： /dev/nvme0n1。在你辨别完成后，记住你的磁盘编号，然后输入：
```bash
cfdisk /dev/你的磁盘
```
你就会看到一个界面
```
                                    Disk: /dev/nvme0n1
                 Size: 476.94 GiB, 512110190592 bytes, 1000215216 sectors
               Label: gpt, identifier: 0B70F9F0-7C38-4F81-9EAB-754397E6079D

    Device                 Start           End      Sectors       Size Type
>>  /dev/nvme0n1p1          2048       2099199      2097152         1G EFI System
    /dev/nvme0n1p2       2099200    1000214527    998115328     475.9G Linux filesystem




 ┌───────────────────────────────────────────────────────────────────────────────────────┐
 │  Partition UUID: D3F1CADC-8559-44B4-A98F-3DCBD07C7B0B                                 │
 │  Partition type: EFI System (C12A7328-F81F-11D2-BA4B-00A0C93EC93B)                    │
 │  Filesystem UUID: 59A1-A47E                                                           │
 │  Filesystem LABEL: EFI                                                                │
 │  Filesystem: vfat                                                                     │
 │  Mountpoint: /boot (mounted)                                                          │
 └───────────────────────────────────────────────────────────────────────────────────────┘
    [ Delete ]  [ Resize ]  [  Quit  ]  [  Type  ]  [  Help  ]  [  Write ]  [  Dump  ]
```

1. 你需要删除所有的分区。选中分区后选择第一个DELETE，直到你的设备一栏里只剩余 ***Free Space***。
2. 你需要选中 Free Space，然后选择 Create，分区大小修改为```1G```，然后选择 Type，找到第一个，EFI，选中。这个分区在后面会被称之为 EFI 分区。请记住它是 ```/dev/***```。
3. 继续把光标放在 Free Space 上，直接回车，然后选择 Write ，输入```y```后，你的磁盘就完成分区了。这个分区在后面会被称之为系统分区。请记住它是 ```/dev/***```。

## 创建文件系统
你需要做的就是（创建 EFI 分区的文件系统、）创建系统分区的文件系统，然后创建一些子卷，最后挂载。你可以按照下面的命令操作。
```bash
# 创建 EFI 分区的文件系统
mkfs.fat -F32 /dev/(EFI分区)

# 创建系统分区的文件系统
mkfs.btrfs -L ArchLinux /dev/(系统分区)

# 挂载分区
mount /dev/(系统分区) /mnt

# 创建子卷
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home

# 卸载
umount /mnt

# 挂载
mount -t btrfs -o subvol=/@,compress=zstd /dev/sdxn /mnt
mount -t btrfs -o subvol=/@home,compress=zstd /dev/sdxn /mnt/home --mkdir
mount /dev/(EFI分区) /mnt/boot --mkdir
```

## 安装基本系统
使用如下命令更新 Keyring 以及安装基本软件包到你的分区。这一步的速度和你的网速有关，可能会持续 5 分钟左右。
```bash
pacman -Sy archlinux-keyring
pacstrap /mnt base base-devel linux linux-firmware btrfs-progs networkmanager vim nano sudo iwd net-tools
```
完成后，输入以下命令将你现在挂载的位置写入你系统中的 fstab。
```bash
genfstab -U /mnt > /mnt/etc/fstab
```
你还需要输入以下命令检验你的 fstab 中是否存在子卷 ID。
```bash
grep "subvolid" /mnt/etc/fstab
```
如果这一步执行后存在输出，请立刻使用编辑器删除类似 ```subvolid=xxx``` 这样的字符。记得同时删除后面的逗号。
```bash
vim /mnt/etc/fstab
```
完成后请按下 ESC 并输入 ```:wq```，回车。

## 配置
### 给新系统换源
```bash
mkdir -p /mnt/etc/pacman.d
cp -r /etc/pacman.d/mirrorlist /mnt/etc/pacman.d
```

### 切换到系统
```bash
arch-chroot /mnt
```
### 主机名称
输入下面的命令设置你电脑的名字（不要出现除了"-"的符号）。例如我的电脑叫 Silver：
```bash
echo "Silver" > /etc/hostname
```

### Hosts
打开 /etc/hosts：
```bash
vim /etc/hosts
```
请使用编辑器加入以下内容：
```
127.0.0.1   localhost
::1         localhost
127.0.1.1   archlinux.localdomain archlinux
```
完成后请按下 ESC 并输入 ```:wq```，回车。

### 语言支持
执行以下命令添加中文以及英文的支持，并将默认语言设置为英语：

> [!NOTE]
> 如果你想问为什么不设置中文，答案是你的终端里没有中文字符的支持，即使直接安装了桌面环境也不行，因为你没有安装中文字体。

1. 使用编辑器打开 `/etc/locale.gen`
```bash
vim /etc/locale.gen
```
2. 在文件内找到以下内容：
```bash
#zh_CN.GBK GBK
#zh_CN.UTF-8 UTF-8
#en_US.UTF-8 UTF-8
```
3. 按下 `i` 键打开编辑模式，找到 `#`，用光标对准其后方，然后把它删掉，以此类推。编辑完后，请按下 `ESC`，然后输入 `:wq` 回车来退出。

4. 生成语言支持
```bash
locale-gen
```

5. 设置系统语言
> [!TIP]
> 现在不能设置中文是因为终端内无法查看中文字符，请在安装完桌面环境和中文字体后再修改语言。
```bash
echo 'LANG=en_US.UTF-8'  > /etc/locale.conf
```

### 时区
1. 使用这条命令设置为上海时间（UTC+8）。
```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
2. 同步到硬件时间。
```bash
hwclock --systohc
```

### Root 的密码
当你执行下面的命令后会让你设置 Root 的密码。输入的字符不会显示。
```bash
passwd root
```

### 安装 Plasma 桌面（可选）
这会同时安装中文字体。
```bash
pacman -S adobe-source-han-sans-cn-fonts plasma konsole dolphin xorg ark neofetch sddm
```

### 开机启动网络管理器
```bash
systemctl enable sddm
systemctl enable NetworkManager
```

### 添加用户
```bash
useradd -m -G wheel -s /bin/bash 你的用户名
passwd 你的用户名
```
你还需要拥有 sudo 的权限：
```bash
vim /etc/sudoers
# ↓ 寻找这一行并且删掉 `#`，如后面有空格，就删掉 `#` 后面的空格。
# %wheel ALL=(ALL:ALL) ALL
```
完成后请按下 ESC 并输入 ```:wq```，回车。


### 安装微码

```bash
pacman -S intel-ucode
```

```bash
pacman -S amd-ucode
```

### 配置引导
1. 使用下列命令安装软件：
```bash
pacman -S grub efibootmgr os-prober
```

2. 使用下列命令安装引导器：
```bash
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH
```

3. 允许发现其他系统：
```bash
vim /etc/default/grub
```
打开后去掉最后一行前面的 ```#```，完成后请按下 ESC 并输入 ```:wq```，回车。

4. 生成配置文件：
```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

### 设置为中文
如果您在前面安装了 Plasma 桌面以及 SDDM，那么现在你就可以把系统切换为中文了。
```bash
rm -rf /etc/locale.conf
echo "zh_CN.UTF-8" >> /etc/locale.conf
```

### 最后一步
你需要退出 Chroot 并且重启。
```bash
exit
reboot
```

## 大功告成
恭喜你，成功的安装了 Arch Linux。