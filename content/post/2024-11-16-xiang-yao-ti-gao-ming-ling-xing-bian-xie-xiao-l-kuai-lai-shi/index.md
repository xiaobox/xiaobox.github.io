---
title: "想要提高命令行编写效率，快来试试这几个快捷键！"
slug: 2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi
date: 2024-11-16T11:18:48.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi/cover.jpg
original_url: https://mp.weixin.qq.com/s/xjeoGfmLzGiKvtr3pqojPA
categories:
  - 工具与效率
tags:
  - Git
---
最近看到一些同学在命令行写命令时的一些低效行为，比如长按左右箭头定位光标、长按 delete 删除字符等。其实只需要掌握几个常用的快捷键就能够大幅提高你写命令的效率。今天我们介绍几个常用的快捷键。

## 移动和删除

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi/001-3acc93cf.png)

### 移动

-   `ctrl + a` : 可以直接将移动光标到命令行首
-   `ctrl + e` : 可以直接移动光标到命令行尾

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi/002-ead710e1.gif)

* * *

-   `ctrl + b` : 光标向后移动一个字符
-   `ctrl + f` : 光标向前移动一个字符

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi/003-20ef4005.gif)

* * *

-   `alt + b` : 光标向后移动一个单词
-   `alt + f` : 光标向前移动一个单词

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi/004-5c92019b.gif)

* * *

### 删除

-   `ctrl + u` : 清除光标前的内容
-   `ctrl + k` : 清除光标后的内容

## 历史命令

只推荐一个：`ctrl + r` : 不但可以查找历史命令，还可以按字符串寻找历史命令

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi/005-efaaa431.gif)

此外，历史命令查询还有一个更牛的命令行工具 **fzf** (https://github.com/junegunn/fzf)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-16-xiang-yao-ti-gao-ming-ling-xing-bian-xie-xiao-l-kuai-lai-shi/006-02af21ad.png)

它是一个交互式过滤程序，可过滤文件、命令历史记录、进程、主机名、书签、git 提交等类型

上文中关于 `ctrl + r` 的 演示如果你在你的机器上尝试效果不一样，其实就是因为安装了 `fzf` ，是 `fzf` 带给我了更友好的交互体验。

许多高手都在用，有许多集成和增强的历史命令查询功能，非常牛！强烈推荐！
