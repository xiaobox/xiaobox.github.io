---
title: "什么是寄存器"
slug: 2020-01-14-shen-me-shi-ji-cun-qi
description: "与java相关的Java编译器输出的指令流，基本上是一种基于栈的指令集架构，而与之相对的另外一套常用的指令集"
date: 2020-01-14T14:46:53.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/cover.jpg
original_url: https://mp.weixin.qq.com/s/x57hnkMXVG8WcJkFXKdHvQ
categories:
  - 系统底层
tags:
  - Java
  - JVM
  - 缓存
  - 架构
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/001-0b6c7e93.jpg)

**与java相关的**

-   Java编译器输出的指令流，基本上是一种基于栈的指令集架构，而与之相对的另外一套常用的指令集架构是基于寄存器的指令集。早期的android，即android4.4之前使用的JVM是Dalvik VM，就是基于寄存器架构的。

-   基于栈的指令集主要的优点是可移植，寄存器由硬件直接提供，程序直接依赖这些硬件寄存器则不可避免地受到硬件的约束。

-   栈架构指令集的主要缺点是执行速度相对来说会稍慢一些。所有主流物理机的指令集都是寄存器架构。

**看示例找感觉**

以上是一些结论，本文的重点是讨论上文中所提的寄存器，那寄存器是什么呢？其实这些计算机的原理知识之前上学的时候都学过，很遗憾当时听的也很头大，现在都还给老师了。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/002-8a0b2bc1.png) 

进入正题，先来看下维基百科的解释：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/003-1aec0950.jpg)

嗯，反正我看完是没什么感觉![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/004-80504576.png)

再来看网上的一个例子：

“*现代计算机，虽然性能很高，但是和上世纪7、8十年代的计算机比，其实结构都差不多。**现在讲存储，一般讲有内存和外存，内存一般有寄存器(register)，缓存(cache)和内存(memory)，有些小型应用例如MCU没有cache，甚至没有memory——直接从flash/ROM到register。**寄存器是CPU基础单元，CPU直接处理的内存就它了，好比医院，医生对面的椅子就是寄存器，要看病的病人(data)就坐这个椅子(register)；**已经挂号的(data)进入诊室(cache)排队，其他的就在医院里（memory）。**医生可以操作的就是面对面的病人，其他人要看病（如急病）也需先坐上这个位置，这是最快的。**诊室里的座位相对于cache，一般cache都是sram存储器，速度很快，但一般cpu不会直接访问，而是要把数据挪到register后才可直接操作，而一般的内存为DRAM，速度比SRAM慢多了，而且通过总线访问，速度就更慢了。*”

再看下图：计算机的存储层次（memory hierarchy）之中，寄存器（register）最快，内存其次，最慢的是硬盘。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/005-b7433e33.png)

最后再看一个计算机的存储体系：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/006-46678dd0.jpg)

图中Registers就是寄存器，怎么样，有点感觉了吗？

**从头来说**

假设我们做一个回向电路，把输出连回到输入，我们用OR门举例：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/007-b467f9e4.jpg)

首先都输入0，那么输出将会是0

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/008-48782ee4.jpg)

如果将A变成1，那么输出将会是1

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/009-fd154135.jpg)

一转眼的功夫输出回到B，那么B为1，OR门看到的结果是输入A、B都为1，

1 OR 1 仍然为1，所以输出不变

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/010-40650bc4.jpg)

如果将A变成0，0 OR 1 输出仍然是 1

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/011-4450bc6a.jpg)

**现在我们有个电路能记录1,**然而却有个小问题，就是无论怎么试，都无法从1变回0（如下两图）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/012-d9e810c9.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/013-0cec84ff.jpg)

现在看一个相同电路，不过这次用AND 门

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/014-da81b6dd.jpg)

A、B均为1，  1 AND 1 为 1

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/015-760ab2c7.jpg)

如果之后A设置为0，由于是AND门，所以输出为0，B为0

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/016-23d121d4.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/017-d88607d7.jpg)

**这个电路能记录0，和之前那个相反,**无论A设置什么值，电路始终输出0

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/018-a7570614.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/019-3ed9450e.jpg)

现在我们有了能记录0和1的电路

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/020-4e92d997.jpg)

为了做出有用的存储，我们将两个电路合起来，变成：AND-OR LATCH

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/021-1d975986.jpg)

它有两个输入：

-   设置（set）   输入，将输出变成1

-   复位（reset）输入，将输出变成0

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/022-5741caa8.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/023-99e775ae.jpg)

如果“设置”和“复位”都是0，电路会输出最后放入的内容，**也就是说它存住了1bit的信息！**这就是存储。

之所以叫“LATCH(闩锁)”，是因为它“锁定”一个特定值并保持状态。将数据放入叫“写入”，将数据输出叫“读取”。好了，现在我们终于有办法存一个bit了。

麻烦的是用两条线来输入，也就是SET和RESET，有点儿麻烦，为了更易用，我们希望只有一条输入线，将它设为0或1来存储值。还需要一根线来“启用”。“启用”时允许写入，没“启用”时锁定。这条线叫“允许写入线”。加一些额外逻辑门，可以做出以下电路 ：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/024-389095d1.jpg)

这个电路称为“门锁”，因为门可以打开或关上。这个电路稍微有些复杂了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/025-55e3b4ff.jpg)

我们不想关心单独的逻辑门，我们封装一下，把“门锁”放到盒子里（一个能存单个bit的盒子）。来看下这个新组件：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/026-2a791b10.jpg)

我们来测试一下这个新组件，一切都从0开始，如果将输入从0变成1，或从1变成0，什么也不会发生，输出仍然是0 。因为WRITE ENABLE 是关闭的（0），来防止内容变化 

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/027-aba3e613.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/028-13ad9386.jpg)

所以当WRITE ENABLE输入1，打开门后可以输入1，并将1存起来，这样输出也是1了。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/029-0d007c71.jpg)

我们可以关掉门（WRITE ENABLE =0），输出会保持1，此时输入随便是什么，输出都不会变（保持1）。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/030-cfc4993f.jpg)

如果再次打开门（WRITE ENABLE =1），如果输入为0，输出也将是0：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/031-eeea8569.jpg)

最后关上门，输出会保持0

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/032-6dac0f1c.jpg)

当然存1bit没什么大用，但我们没限制只能用一个组件，如果我们并排放8个，可以存8位，比如一个8bit数字。**一组这样的组件叫寄存器**。寄存器能存多少个Bit,叫“位宽”。早期电脑用8位寄存器，然后是16位，32位，如今很多计算机都有64位宽的寄存器了。

CPU中寄存器又分为指令寄存器（IR）、程序计数器（PC）、地址寄存器（AR）、数据寄存器（DR）、累加寄存器（AC）、程序状态字寄存器（PSW），这里就不深入讨论了。

参考 ：

http://www.ruanyifeng.com/blog/2013/10/register.html

https://www.youtube.com/watch?v=fpnE6UAfbtU

https://www.youtube.com/watch?v=cNN\_tTXABUA

https://www.youtube.com/watch?time\_continue=132&v=TBADs7knuWM&feature=emb\_logo

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-01-14-shen-me-shi-ji-cun-qi/033-d0c0b7f2.jpg)

**关注公众号 获取更多精彩内容**
