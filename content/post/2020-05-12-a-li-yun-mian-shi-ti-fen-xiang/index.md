---
title: "阿里云面试题分享"
slug: 2020-05-12-a-li-yun-mian-shi-ti-fen-xiang
description: "突如其来的电话面试事情是这样的，今天吃完晚饭在外面公园遛达了一圈，回到家没一会儿接到了一个电话，说是阿里云的"
date: 2020-05-12T14:23:10.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-05-12-a-li-yun-mian-shi-ti-fen-xiang/cover.jpg
original_url: https://mp.weixin.qq.com/s/3f-ERs0xULQgMQem42HvxA
categories:
  - 行业与思考
tags:
  - Java
  - 面试
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-05-12-a-li-yun-mian-shi-ti-fen-xiang/001-9285f426.jpg)

突如其来的电话面试

事情是这样的，今天吃完晚饭在外面公园遛达了一圈，回到家没一会儿接到了一个电话，说是阿里云的，心中疑惑，不对呀，我刚收到回阿里的拒信（之前投过，被拒了）。

聊了一下，虽然不太清楚阿里的流程，但老哥态度特别好，电话面试一下总是没问题的。

下面分享下问题

**一 给你一个 ipv4 的地址，把它转到 Int , 用一个Int变量装。**

这个题很明显直接装是有可能越界装不下的。int是32位。long倒是可以。

我想了一会儿说了一个答案，没对，后来老哥给我解释了一下，然后恍然大明白了，其实是个小技巧。直接上代码吧。

```java
/**
 * 将 ip 字符串转换为 int 类型的数字
 * <p>
 * 思路就是将 ip 的每一段数字转为 8 位二进制数，并将它们放在结果的适当位置上
 *
 * @param ipString ip字符串，如 127.0.0.1
 * @return ip字符串对应的 int 值
 */
public static int ip2Int(String ipString) {
    // 取 ip 的各段
    String[] ipSlices = ipString.split("\\.");
    int rs = 0;
    for (int i = 0; i < ipSlices.length; i++) {
        // 将 ip 的每一段解析为 int，并根据位置左移 8 位
        int intSlice = Integer.parseInt(ipSlices[i]) << 8 * i;
        // 求与
        rs = rs | intSlice;
    }
    return rs;
}

```java

**那怎么再从int 转成ipv4 字符串呢？**

其实也很简单，思路是一样的，将 int 值的 32 位分为 4 个 8 位数字，然后这 4 个 8 位的数字用 0~255 的数字进行表示，用点号分隔即可。我们也基于位运算，7 行代码即可实现。

```cpp
/**
 * 将 int 转换为 ip 字符串
 *
 * @param ipInt 用 int 表示的 ip 值
 * @return ip字符串，如 127.0.0.1
 */
public static String int2Ip(int ipInt) {
    String[] ipString = new String[4];
    for (int i = 0; i < 4; i++) {
        // 每 8 位为一段，这里取当前要处理的最高位的位置
        int pos = i * 8;
        // 取当前处理的 ip 段的值
        int and = ipInt & (255 << pos);
        // 将当前 ip 段转换为 0 ~ 255 的数字，注意这里必须使用无符号右移
        ipString[i] = String.valueOf(and >>> pos);
    }
    return String.join(".", ipString);
}

```

**二 设计一个分布式的图片存储系统 QPS：5K以上 可以使用通用的中件间。**

      针对这个问题我扯了半天，感觉有些在点儿上，有些不在，想来如果你设计过，有过设计经验应该多数能说到点儿上。别的不说，光可高用就能扯半天，比如集群故障情况下的失效转移（Failover）。不同故障下的解决方案（瞬间故障、临时故障、永久故障）。网上相关资料也挺多的，可以参考开源系统的设计比如：FastDFS。是一个由 C 语言实现的开源轻量级分布式文件系统(https://github.com/happyfish100/fastdfs)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-05-12-a-li-yun-mian-shi-ti-fen-xiang/002-f2e7317d.jpg)

关注公众号 获取更多精彩内容
