---
title: "Chrome 浏览器小恐龙游戏变身超级马利奥"
slug: 2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma
description: "在线也能玩儿很多朋友都玩儿过 chrome 浏览器在断网情况下的小恐龙游戏其实它也可以在有网的情况下玩儿在浏"
date: 2021-08-27T07:58:36.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/cover.jpg
original_url: https://mp.weixin.qq.com/s/lRw2qneXxQ-n1vR_fHr2BA
categories:
  - 工具与效率
tags:
  - Chrome
---
## 在线也能玩儿

很多朋友都玩儿过 chrome 浏览器在断网情况下的小恐龙游戏

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/001-e20bf51a.jpg)

其实它也可以在有网的情况下玩儿

在浏览器的地址栏输入 `chrome://dino` 并回车就可以了

而且它还会自动放大，更适合在浏览器玩儿

## 替换小恐龙为其他角色

### 第一步

打开浏览器在地址栏输入  `chrome://dino` 并回车

### 第二步

F12 打开控制台，找到 id 为 `offline-resources` 的 div 标签，在里面找到 id 为 `offline-resources-1x` 的 img 标签中的 src。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/002-e21bea5f.jpg)

复制出 src 内的内容，粘贴到浏览器地址栏中，可以看到如下图片：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/003-5c6768f5.jpg)

最后面那 8 只恐龙就是我们在界面上看到的内容，也就是要修改替换的对象。

8 只恐龙所代表的动作是

-   一、二张是跳起来的动作
-   三、四张是走路的动作
-   五、六张是死掉的动作
-   七、八是蹲下时的动作

### 第三步

我们从这个网站 https://www.spriters-resource.com/ 找一些角色图片来当替换资源用，里面有很多熟悉的角色，比如马利奥

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/004-b611dbe9.jpg)

### 第四步

我们将找到的资源图片和原始的小恐龙游戏图片全部下载下来，然后用 PS 进行操作替换（PS 不熟悉的可以找熟悉 PS 的小伙伴帮忙，我找的是我老婆，哈哈）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/005-44d067e3.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/006-e6d65229.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/007-84d2e66e.jpg)

最后的成品大概是这样：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/008-179a88c9.jpg)

### 最后一步

将编辑好的图片导出为 PNG 格式，然后上传个图床（只要能通过网络访问到就行）

回到浏览器，地址栏输入 `chrome://dino/` 打开小恐龙，F12 找到我们刚才找过的 id 为 `offline-resources-1x` 的 img 标签中的 src，将地址内容替换为我们在图床上的地址

再重新运行游戏，小恐龙就变成马利奥了

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2021-08-27-chrome-liu-lan-qi-xiao-kong-long-you-xi-bian-shen-chao-ji-ma/009-2be76787.jpg)

## Chrome 插件

如果你很懒，想直接上手玩儿，也可以安装 Chrome 插件，有网友已经做好了现成的

https://github.com/superj80820/chrome-dino-cosplay
