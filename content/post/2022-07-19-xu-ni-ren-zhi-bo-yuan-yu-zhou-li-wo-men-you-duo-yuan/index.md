---
title: "虚拟人直播-元宇宙离我们有多远？"
slug: 2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan
description: "利用 Live Link Face + unrealEngine + quixel bridge 方案，实现虚拟形象的建模和控制。为后面的直播等应用搭建基础流程。"
date: 2022-07-19T05:32:45.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/cover.jpg
original_url: https://mp.weixin.qq.com/s/h-Ow4CW5uuTARvFT_zwShw
categories:
  - 杂谈
---
## 目标

利用 `Live Link Face` + `unrealEngine` + `quixel bridge` 方案，实现虚拟形象的建模和控制。为后面的直播等应用搭建基础流程。

## 安装和配置

### unrealEngine （虚幻引擎）

需要从下面的链接先下载  `Epic Games launcher` 安装好后，再下载并安装 `unrealEngine`

https://www.unrealengine.com/en-US/download

我下载的是 `Unreal Engine 5.0.3` 的版本

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/001-f1139ee7.jpg)

### quixel bridge

如果是 5 之前的版本，可以到官网下载 ：https://quixel.com/bridge

5 的话会自己带这个插件不用单独下载了。

### metahuman

https://www.unrealengine.com/en-US/metahuman

要申请 “参加抢先体验”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/002-67a18eb0.jpg)

提交申请以后会到这个界面 ：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/003-e116ec3f.jpg)

看到下图就 OK 了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/004-0cf6aacb.jpg)

从这里往后等待的时间会比较长，首先点击 `Launch latest MetaHuman Creator`

然后不到一分钟左右到这里，这里要等待好几分钟，视你的网络情况而定

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/005-3a8de90c.jpg)

你看到这个界面后就进来了：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/006-12715433.jpg)

你是可以自己创建角色的，当然也可以用预置好的这些，我用一个预置的角色演示：

### 启动虚幻引擎

因为网络问题等了好久才启动成功

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/007-ab28284f.jpg)

然后创建一个项目，选游戏和空白模版就可以了

软件第一次启动后，你想用 bridge 导入时会发现有错误提示，需要再安装一个 `web browser` 插件才能用 bridge ，具体是这里的第二个：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/008-dcf787f8.jpg)

接着登录 bridge，找到你之前创建的角色，把它导入到 虚幻引擎的工程中

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/009-055aa6c8.jpg)这里找到我们刚才编辑的角色

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/010-c7a2790e.jpg)经过漫长的等待，终于可以导入角色了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/011-197323d1.jpg)

会提示要启用插件，点击启用后重启软件。

重启过程中漫长的等待，然后软件 终于打开了。

在漫长的等待中你会经过 N 次这个：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/012-0666e362.jpg)

### 导入角色

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/013-8933c450.jpg)

选 BP 开头的文件

### Live Link Face

iphone x  以上手机安装 live link face 应用 ，手机用线连接到电脑。

然后左上角设置→Live  Link→ 点击添加目标，输入 PC 的 IP ，端口用默认的。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/014-16eb7808.jpg)

遗憾的是虚幻5 各种尝试后都无法显示出 iphone 我的型号是 iphoneXR ，试了 iphoneXS也不行，也折腾了网络，还是不行，于是还是改用低版本 4.27 也还是没连上，实在太费时间就放弃了。所以 4 和 5 我都没连通，哎。

好处是 4.27 有一个官方的免费 demo 可以下载使用，叫 “faceAR” ，从虚幻商城下载，直接拿来用，比较快，也不用自己通过 metahuman 建模型了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/015-d092b074.jpg)

### 效果

虽然我由于各种原因没有连通，但思路就是这样的，最终的效果就是你对着手机做动作，它就可以实时同步到虚拟人那端了，来看看成功的效果:

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/016-0ef7bc2d.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/017-8fa3c8ff.jpg)

如果是直播的话，可以把虚拟显示结果直接利用 `OBS` 推流到直播平台。

### 注意

-   安装过程中如遇到网络问题，请使用科学上网。
-   建议使用性能较好的电脑，否则等待时间过长，CPU 在安装和使用过程中经常会 100% ，也没法用。
-   如遇到 “正在编辑着色器” 、“正在准备着色器” 一类的提示，没什么更好的办法加速，请耐心等待。
-   虚幻 5 是不错，但非常卡，我的设备是 macbook Pro i7 6 核 32G 内存，CPU 直接 100%了。所以我觉得 5 还是得 m1 芯片才顶得住。

## 应用

-   直播
-   游戏
-   AR
-   元宇宙

想像空间很大，直播应该已经有人做了，youtube 有个叫 `CodeMiko` 可以看下。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/018-d0ea4cb1.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/019-50525ff6.jpg)

CodeMiko 背后其实是一个真实的人，她通过动作捕捉技术，实现与虚拟人的语言和动作同步。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-07-19-xu-ni-ren-zhi-bo-yuan-yu-zhou-li-wo-men-you-duo-yuan/020-b04d8889.jpg)

国内也已经有人在做了，可能将来从各大短视频平台能陆续看到这类虚拟主播了

### 有没有人买账？

不用担心，买账的比你想像的多。

**所以，一直说炒概念的元宇宙离我们真的很远吗？**

## 参考

-   https://www.bilibili.com/video/BV1GB4y1M7iH?spm\_id\_from=333.337.search-card.all.click&vd\_source=6fb7f58b736bb5913c33073b42979450
-   https://www.youtube.com/watch?v=OH4lXi0HAKo
-   https://www.bilibili.com/read/cv15994528/
-   https://www.bilibili.com/video/BV1LV411r7Sk/?spm\_id\_from=333.788.recommend\_more\_video.1&vd\_source=6fb7f58b736bb5913c33073b42979450
