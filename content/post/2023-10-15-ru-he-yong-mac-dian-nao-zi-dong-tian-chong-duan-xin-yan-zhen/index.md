---
title: "如何用 Mac 电脑自动填充短信验证码"
slug: 2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen
description: "“提示：以下方法只适用于拥有 Mac电脑+iPhone手机的用户”短信验证码是我们在登录网站时经常会使用的一"
date: 2023-10-15T09:41:59.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen/cover.jpg
original_url: https://mp.weixin.qq.com/s/evGDIyCU_bMnGj1Ayd80_w
categories:
  - 工具与效率
tags:
  - JavaScript
  - macOS
  - Chrome
---
> “
> 
> 提示：以下方法只适用于拥有 Mac电脑+iPhone手机的用户
> 
> ”

短信验证码是我们在登录网站时经常会使用的一种方式

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen/001-72af25e1.png)

如果你使用的是移动应用即 APP 那么通过验证码登录的一般情形是：

1.  打开 APP 登录页，输入手机号，点击 “获取验证码”
2.  收到一条短信，打开短信，记住验证码内容，一般是6位左右的数字，然后手动录入到验证码输入框。或者像苹果 iOS 这样的系统可以自动将短信中的验证码在键盘区域提示出来。你只需要再点一下就可以了，很省事儿 ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen/002-1e13ecda.png)
3.  点击 “登录” 结束。

虽然在 APP 上操作也要三、四步，不过整个过程还是比较流畅和自然的，尤其是在 iPhone 上。可能最麻烦的点就是在切换到短信的应用，靠脑子记住验证码再切换回 APP 这步了。

然而相对于网页上的 web 应用，在 APP 上的操作体验已经算好的了。来看一下我们平常用电脑打开某网站然后通过验证码登录的情形是怎样的吧：

1.  打开浏览器，打开某网站并跳转到登录页，输入手机号， 点击 “获取验证码”
2.  手机上收到一条短信，这时候会慌慌张张的找手机（因为验证码有有效期），然后打开短信，赶快记住验证码。
3.  回到电脑上把刚才记住的验证码手动一个数字一个数字的录入到验证码输入框。有时候还记错了，或者录错了，再回到手机上看几遍。
4.  点击 “登录” 结束。

针对这个流程，给我的体验有几点不爽：

-   第一 两个设备来回切换，一会儿折腾手机，一会儿折腾电脑的，麻烦！
-   第二 就跟让系统“拿捏” 了一样，在等待验证码的这段时间我这两个设备什么都干不了，生怕错过了有效期。慌张！
-   第三 整个操作下来，时间较长，而且由于有设备切换，发生错误的可能性增加了，整个流程花费的时间比在 APP 上长， 低效！

总结下来， 在手机上的操作还可以，在电脑上的操作我忍受不了，太不方便了！！！

* * *

实际上，作为程序员的我，早已不受这种折磨了，因为我有至少两种办法来解决电脑上用短信验证码登录的痛苦。这里再次强调 需要 Mac 电脑+iPhone 手机，这是前提。

### 方法一 苹果原生解决方案

如果你的设备都是苹果的，那么它其实是有原生的解决方案的，总结起来就是：

> “
> 
> 短信转发 + Safari浏览器自动回填
> 
> ”

这个方法分两步，第一步是短信转发，即设置 iPhone 以在 Mac 上获取短信，达到的效果是：当你的 iPhone 手机上收到一条短信后， Mac 电脑上的 “信息” 应用也会同步收到，并在电脑上提示你。

具体的设置也非常简单：

1.  在 iPhone 上，前往“设置”>“信息”。

2.  轻点“短信转发”。【注】如果没有看到“短信转发”，请确保在 iPhone 和 Mac 上通过相同 Apple ID 登录 iMessage 信息。

3.  在设备列表中打开你的 Mac。

4.  如果未使用双重认证，Mac 上会显示六位数字激活码；在 iPhone 上输入这个激活码，然后轻点“允许”。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen/003-3d6c4023.png)

这样你就完成了第一步，当手机收到短信时，Mac 电脑上也能同步收到了。😁

第二步 更简单了，没有任何设置，你只需要用 Safari 浏览器，打开你要登录的网站，然后当手机收到短信后，Safari 会把短信里的验证码自动填充到验证码输入框，无需任何操作。（当然实际过程是因为打开了短信转发，短信先转发到了 Mac 电脑上，才能被 Safari 浏览器获取）

来看一下效果：

已关注

Follow

Replay Share Like

Close

**观看更多**

更多

*退出全屏*

[](javascript:;)

*切换到竖屏全屏**退出全屏*

小盒子的技术分享已关注

[](javascript:;)

Share Video

，时长00:13

0/0

00:00/00:13

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

00:13

00:13

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

如何用 Mac 电脑自动填充短信验证码

观看更多

转载

,

如何用 Mac 电脑自动填充短信验证码

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)

方法二 短信转发+开源软件

我知道很多同学不喜欢用 Safari ，或者说有更喜欢和习惯使用的浏览器，比如 Chrome,在这种情况下我们就不能用苹果原生大法了，需要结合开源软件来实现之前的效果。也是分两步。第一步和方法一一样，需要把 “短信转发” 设置好，参考上文，这里就不赘述了。

第二步我们需要有个软件能够实现将短信中的验证码解析出来，并自动填到相应的位置上。我找到一个名为 MacCopier 的应用，地址如下：https://github.com/DreamSaddle/MacCopier

如果大家下载 MacCopier 有困难，可以点击文章底部的按钮关注此公众号，私信回复：“MacCopier” ,我会分享给大家。

当然也有其他应用比如需要付费的 2fhey 不差钱的同学可以选择这个。（我差钱，所以我用开源免费的 MacCopier ）

MacCopier 安装好后，需要为其设置 完全磁盘访问权限 步骤如下：

1.  打开 系统偏好设置 > 安全性与隐私![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen/004-e58fd084.png)

2.  左下角解锁设置后，找到 完全磁盘访问权限 选项，在右侧列表中找到 MacCopier 将其勾选上即可。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen/005-a767f439.png)

3.  您也可以勾选 登录时启动，这将会在下次登录系统时自动运行此应用。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2023-10-15-ru-he-yong-mac-dian-nao-zi-dong-tian-chong-duan-xin-yan-zhen/006-edb88460.png)

4.  您也可以勾选 自动粘贴，这将会在提取出验证码后自动粘贴到系统当前光标处。自动粘贴功能需要您为 MacCopier开启辅助功能权限。

可能有的同学会担心用这种第三方应用会不会有数据安全问题？

应该担心，尤其是涉及敏感信息的应用大家应该有安全意识，不能为了方便不顾信息安全。所以我仔细地看过了 MacCopier 的源码（Rust写的），除了本地的操作外，没有任何网络连接，可以放心用，不会构成安全问题，就是个本机跑的小工具应用而已。

最后我用 Chrome 浏览器 演示一下使用了 MacCoier后的效果。

已关注

Follow

Replay Share Like

Close

**观看更多**

更多

*退出全屏*

[](javascript:;)

*切换到竖屏全屏**退出全屏*

小盒子的技术分享已关注

[](javascript:;)

Share Video

，时长00:14

0/0

00:00/00:14

切换到横屏模式

继续播放

进度条，百分之0

[Play](javascript:;)

00:00

/

00:14

00:14

[倍速](javascript:;)

*全屏*

倍速播放中

[0.5倍](javascript:;) [0.75倍](javascript:;) [1.0倍](javascript:;) [1.5倍](javascript:;) [2.0倍](javascript:;)

[超清](javascript:;) [流畅](javascript:;)

Your browser does not support video tags

继续观看

如何用 Mac 电脑自动填充短信验证码

观看更多

转载

,

如何用 Mac 电脑自动填充短信验证码

小盒子的技术分享已关注

Share点赞Wow

Added to Top Stories[Enter comment](javascript:;)

[Video Details](javascript:;)

可以看到与方法一的效果是一样的。

### 总结

无论是使用方法一还是方法二，在 Mac 电脑上都可以实现：短信验证码自动接收+自动解析+自动回填操作

再也不用花心力（尤其是工作忙的时候，记这破玩意只会更烦躁）记验证码了，也不用手忙脚乱地在两个设置间来回切换了。
