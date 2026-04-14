---
title: "阿里面试分享"
slug: 2020-04-25-a-li-mian-shi-fen-xiang
description: "通过与透露题目的朋友得知以下两题出自蚂蚁金服的远程一面。题目本身并不很难，难的是在阿里评测的平台上，脱离ID"
date: 2020-04-25T07:49:29.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-25-a-li-mian-shi-fen-xiang/cover.jpg
original_url: https://mp.weixin.qq.com/s/jC_mcoHlrZNtCYSI4MN-DA
categories:
  - 行业与思考
tags:
  - Java
  - 面试
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-04-25-a-li-mian-shi-fen-xiang/001-488ca04f.jpg)

通过与透露题目的朋友得知以下两题出自蚂蚁金服的远程一面。

题目本身并不很难，难的是在阿里评测的平台上，脱离IDE，徒手coding。那个平台其实就是给你一个网址打开就像记事本一样，面试官可以实时看到你写的什么，你以可以说话跟他语音交流。

**No1** 

**请用java实现以下shell脚本的功能**

 **cat /home/admin/logs/webx.log | grep "Login" | uniq -c | sort -nr**

  **从webx.log里查找包含"Login"的行，去重并排序** 

**我的实现：**
