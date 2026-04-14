---
title: "synchronized 锁的是什么？"
slug: 2022-02-15-synchronized-suo-de-shi-shen-me
description: "synchronized 锁的是什么？"
date: 2022-02-15T09:25:38.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/cover.jpg
original_url: https://mp.weixin.qq.com/s/pHl86_fFDfKpf9Ly3tvU8A
categories:
  - 后端
tags:
  - Java
  - JVM
  - 网络
---
## 概述

本文我们将回答两个问题：

1.  synchronized 锁的是什么？
2.  为什么 wait() 和 notify() 需要搭配 synchonized 关键字使用 ？

我将通过先介绍基础知识再回答问题的方式来解答这两个问题，了解了前面的基础知识后，问题也就迎刃而解了。

## 前知识-对象头（mark word）

### 内存布局

我们知道 java 对象的内存布局如下图所示：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/001-63a417ae.jpg)而其中对象头区域包含  markword 和 class pointer

### 利用 JOL 可以分析内存中的对象布局

> “
> 
> JOL 的全称是 Java Object Layout。是一个用来分析 JVM 中 Object 布局的小工具。包括 Object 在内存中的占用情况，实例对象的引用情况等等。
> 
> ”

添加依赖

```java
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.10</version>
</dependency>

public class A {

    //占一个字节的 boolean 字段
    private boolean flag;

    public static void main(String[] args) {
        A a = new A();

        //打印对应的对象头信息
        System.out.println(ClassLayout.parseInstance(a).toPrintable());
    }
}

```

我们利用上面的程序对对象头的内存情况进行一下探究。上面程序执行后的结果如下图：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/002-f31df808.jpg)这里 一共 16 个字节

-   mark word 占了 8 个字节
-   class pointer 类型指针占了 4 个字节
-   实例数据 1 个字节
-   对齐填充部分 3 个字节

其中由于 JVM 开启了指针压缩，所以 class pointer  是 4 个字节，如果关闭指针压缩（添加 vm 参数：`-XX:-UseCompressedOops`），则是 8 个字节。

另外，64 位虚拟机上对象的大小必须是 8 的倍数，上图中一共 16 个字节，是 8 的倍数。

### 对象头

根据  文档 （http://openjdk.java.net/groups/hotspot/docs/HotSpotGlossary.html） 得知 对象头有两个 word , 其一为 markword ，另一为 klass pointer

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/003-c70346a2.jpg)通过上面的例子我们已经知道了，在开启指针压缩的情况下 对象头（mark workd + klass pointer） 一般占 12 个字节。

但是，如果对象是数组，情况就不一样了。当对象是一个数组对象时，那么在对象头中有一个保存数组长度的空间，占用 4 字节（32bit）空间

```java
public class A {

    //占一个字节的 boolean 字段
    private boolean flag;

    public static void main(String[] args) {

        A[] a = new A[2];

        //打印对应的对象头信息
        System.out.println(ClassLayout.parseInstance(a).toPrintable());
    }
}

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/004-aaf12575.jpg)

可以看到 对象头（object header）又多了 4 个字节用于存放数组长度。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/005-637c9802.jpg)

### klass pointer

`Klass Pointer`是一个指向方法区中`Class`信息的指针，虚拟机通过这个指针确定该对象属于哪个类的实例。

在 64 位的 JVM 中，支持指针压缩功能，根据是否开启指针压缩，`Klass Pointer`占用的大小将会不同：

-   未开启指针压缩时，类型指针占用 8B (64bit)
-   开启指针压缩情况下，类型指针占用 4B (32bit)

### 指针压缩原理

我们将程序从 32 位移到 64 位是为了程序性能的提升，但是涉及 JVM 的情况并非总是如此，造成这种性能下降的主要原因是 64 位对象引用。

64 位引用占用的空间是 32 位引用的两倍，这通常导致更多的内存消耗和更频繁的 GC 周期，而且对象的引用完全用不到 64 位，因为 64 位代表的内存大小为 2^64，其内存大小完全达不到，因此就需要压缩指针来获取性能上的提升。

内存寻址是以字节为单位 ，32 位寻址空间约 4GB （4 \* 1024 \* 1024 \* 1024 Byte） = 2 的 32 次方。同理 64 位理论上可以达到 2 的 64 次方字节，2097152T

我们知道 JVM 对象对齐会使对象的大小都是 8 字节的倍数，这会使 oops 的最后三位始终为零，这是因为 8 的倍数始终以二进制 000 结尾。

这 3 位 000 在堆中的存储是完全没有意义的，因此我们可以将这 3 位用来存储更多的内存地址，相当于 35 位的地址压缩在 32 位地址上使用，这样我们内存使用就从原来的 2^32=4G 提升为 2^35=32G。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/006-0cbc2fc9.jpg)

何为 Oop?

Oop(ordinary object pointer)，可以翻译为普通对象指针，指向的是 Java 对象在内存中的引用。

哪些对象会被压缩？

如果配置 JVM 参数 UseCompressedOops 为 true，则代表启用压缩指针，则将压缩堆中的以下 oops：

-   每个对象头的 klass 字段
-   每个 oop 实例字段
-   oop 数组（objArray）的每个元素

需要注意的是，在 UseCompressedOops 已经开启的基础上，klass 可以通过 UseCompressedClassPointers 单独设置是否开启。UseCompressedClassPointers 必须基于 UseCompressedOops 开启的情况下才可以设置是否开启，如果 UseCompressedOops 设为 false，则 UseCompressedClassPointers 无法设置为 ture。

### mark word

具体来看一下 `markword`  的内部结构

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/007-daf6bef9.jpg)

32 位的

根据 JVM 源码

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/008-f617e71f.jpg)

64 位的

具体我们写代码看一下：

```java
public class A {

    //占一个字节的 boolean 字段
    private boolean flag;

    public static void main(String[] args) {

        A a = new A();

        out.println("before hash");
        out.println(ClassLayout.parseInstance(a).toPrintable());

        //jvm 计算 HashCode
        out.println("jvm----------" + Integer.toHexString(a.hashCode()));

        //当计算完 HashCode 之后，我们可以查看对象头的信息变化
        out.println("after hash");
        out.println(ClassLayout.parseInstance(a).toPrintable());
    }
}

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/009-8b762bc9.jpg)

可以看到我们在没有进行 hashcode 运算的时候，所有的值都是空的。当我们计算完了 hashcode，对象头就是有了数据。因为是小端存储，所以你看的值是倒过来的。前 25bit 没有使用所以都是 0，后面 31bit 存的 hashcode。这跟上图 64 位 markword 所描述的一样。

那么在无锁状态下  `ojbect header`  第一个字节 8 位存储的就是：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/010-5a612637.jpg)

即 00000001 。

最后一位代表的锁标志为 1 ，表示该对象 无锁。

然而锁标志位 2bit 只能表示 4 种状态（00,01,10,11）JVM 的做法将偏向锁和无锁的状态表示为同一个状态，然后根据上图中偏向锁的标识再去标识是无锁还是偏向锁状态。

Java 的对象头在对象的不同的状态下会有不同的表现形式，主要有三种状态

-   无锁状态
-   加锁状态
-   GC 标记状态

那么就可以理解 Java 当中的上锁其实可以理解给对象上锁，也就是改变对象头的状态 synchronized 锁的是什么？

### 当 Java 处在偏向锁、重量级锁状态时，hashcode 值存储在哪？

> “
> 
> 简单 答案 是：
> 
> -   当一个对象已经计算过 identity hash code，它就无法进入偏向锁状态；
> -   当一个对象当前正处于偏向锁状态，并且需要计算其 identity hash code 的话，则它的偏向锁会被撤销，并且锁会膨胀为重量锁；
> -   重量锁的实现中，ObjectMonitor 类里有字段可以记录非加锁状态下的 mark word，其中可以存储 identity hash code 的值。或者简单说就是重量锁可以存下 identity hash code。
> 
> 请一定要注意，这里讨论的 hash code 都只针对 identity hash code。用户自定义的 hashCode() 方法所返回的值跟这里讨论的不是一回事。
> 
> Identity hash code 是未被覆写的 java.lang.Object.hashCode() 或者 java.lang.System.identityHashCode(Object) 所返回的值。
> 
> ”

## 前知识-JAVA 中的锁

### 偏向锁

作用

偏向锁是为了消除无竞争情况下的同步原语，进一步提升程序性能。其目标就是在只有一个线程执行同步代码块时能够提高性能。

与轻量级锁的区别

轻量级锁是在无竞争的情况下使用`CAS`操作来代替互斥量的使用， 从而实现同步；而偏向锁是在无竞争的情况下完全取消同步。

与轻量级锁的相同点

它们都是乐观锁，都认为同步期间不会有其他线程竞争锁。

撤消

偏向锁的撤销，需要等待全局安全点（在这个时间点上没有字节码正在执行），它会首先暂停拥有偏向锁的线程，判断锁对象是否处于被锁定状态。撤销偏向锁后恢复到无锁（标志位为“01”）或轻量级锁（标志位为“00”）的状态。

偏向锁的延迟

虚拟机在启动的时候对于偏向锁有延迟。为什么要延迟呢？

JVM 刚启动的时候，一定是有很多的线程在运行，操作系统也是知道的，所以明明知道有高并发的场景，所以就延迟了 4s。

原理

当线程请求到锁对象后， 将锁对象的状态标志位改为 01， 即偏向模式。然后使用`CAS`操作将线程的 ID 记录在锁对象的 Mark Word 中。

以后该线程可以直接进入同步块， 连`CAS`操作都不需要。但是，一旦有第二条线程需要竞争锁，那么偏向模式立即结束，进入轻量级锁的状态。

优点

偏向锁可以提高有同步但没有竞争的程序性能。但是如果锁对象时常被多条线程竟争，那偏向锁就是多余的。

匿名偏向

刚刚 new 完这个对象还没有任何线程持有这把锁，那它偏向谁呢，这种的谁也不偏向，叫做匿名偏向。

我们刚刚 new 出来的对象，如果偏向锁启动是匿名偏向，没有启动就是普通对象。

```java
public class A {

    //占一个字节的 boolean 字段
    private boolean flag;

    public static void main(String[] args) throws InterruptedException {

        //延迟 5s
        // TimeUnit.SECONDS.sleep(5);

        A a = new A();

        out.println("before hash");
        out.println(ClassLayout.parseInstance(a).toPrintable());

        //jvm 计算 HashCode
        out.println("jvm----------" + Integer.toHexString(a.hashCode()));

        //当计算完 HashCode 之后，我们可以查看对象头的信息变化
        out.println("after hash");
        out.println(ClassLayout.parseInstance(a).toPrintable());
    }
} 

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/011-222acb04.jpg)

这里要联系对象头一起理解

JVM 参数

```
-XX:BiasedLockingBulkRebiasThreshold = 20   // 默认偏向锁批量重偏向阈值
-XX:BiasedLockingBulkRevokeThreshold = 40   // 默认偏向锁批量撤销阈值
-XX:+UseBiasedLocking // 使用偏向锁，jdk6 之后默认开启
-XX:BiasedLockingStartupDelay = 0 // 延迟偏向时间，默认不为 0，意思为 jvm 启动多少 ms 以后开启偏向锁机制（此处设为 0，不延迟）

```

*偏向锁可以通过虚拟机的参数来控制它是否开启。*

批量重偏向与批量撤消

渊源  从偏向锁的加锁解锁过程中可看出，当只有一个线程反复进入同步块时，偏向锁带来的性能开销基本可以忽略，但是当有其他线程尝试获得锁时，就需要等到 safe point 时，再将偏向锁撤销为无锁状态或升级为轻量级，会消耗一定的性能，所以在多线程竞争频繁的情况下，偏向锁不仅不能提高性能，还会导致性能下降。于是，就有了批量重偏向与批量撤销的机制。

原理：以 class 为单位，为每个 class 维护一个偏向锁撤销计数器，每一次该 class 的对象发生偏向撤销操作时，该计数器+1，当这个值达到重偏向阈值（默认 20）时，JVM 就认为该 class 的偏向锁有问题，因此会进行批量重偏向。

每个 class 对象会有一个对应的 epoch 字段，每个处于偏向锁状态对象的 Mark Word 中也有该字段，其初始值为创建该对象时 class 中的 epoch 的值。每次发生批量重偏向时，就将该值+1，同时遍历 JVM 中所有线程的栈，找到该 class 所有正处于加锁状态的偏向锁，将其 epoch 字段改为新值。下次获得锁时，发现当前对象的 epoch 值和 class 的 epoch 不相等，那就算当前已经偏向了其他线程，也不会执行撤销操作，而是直接通过 CAS 操作将其 Mark Word 的 Thread Id 改成当前线程 Id。当达到重偏向阈值后 ，假设该 class 计数器继续增长，当其达到批量撤销的阈值后（默认 40），JVM 就认为该 class 的使用场景存在多线程竞争，会标记该 class 为不可偏向，之后，对于该 class 的锁，直接走轻量级锁的逻辑。

解决场景：批量重偏向（bulk rebias）机制是为了解决：一个线程创建了大量对象并执行了初始的同步操作，后来另一个线程也来将这些对象作为锁对象进行操作，这样会导致大量的偏向锁撤销操作。批量撤销（bulk revoke）机制是为了解决：在明显多线程竞争剧烈的场景下使用偏向锁是不合适的。

具体例子可以参考：https://www.cnblogs.com/LemonFive/p/11248248.html

流程

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/012-8f663fcf.jpg)

### 轻量级锁

`轻量级锁` 是相对于`重量级锁` 而言的，而重量级锁就是传统的锁。

本质

使用 CAS 取代互斥同步。

轻量级锁与重量级锁的比较：

重量级锁是一种悲观锁，它认为总是有多条线程要竞争锁，所以它每次处理共享数据时，不管当前系统中是否真的有线程在竞争锁，它都会使用互斥同步来保证线程的安全；

而轻量级锁是一种乐观锁，它认为锁存在竞争的概率比较小，所以它不使用互斥同步，而是使用 CAS 操作来获得锁， 这样能减少互斥同步所使用的『互斥量』带来的性能开销。

实现原理

当线程请求锁时， 若该锁对象的 Mark Word 中标志位为 01（未锁定状态） ， 则在该线程的栈帧中创建一块名为`锁记录` 的空间， 然后将锁对象的 Mark Word 拷贝至该空间；最后通过 CAS 操作将锁对象的 Mark Word 指向该锁记录；

若 CAS 操作成功， 则轻量级锁的上锁过程成功；·若 CAS 操作失败， 再判断当前线程是否已经持有了该轻量级锁；若已经持有， 则直接进入同步块；若尚未持有，则表示该锁已经被其他线程占用，此时轻量级锁就要膨胀成重量级锁。

前提

轻量级锁比重量级锁性能更高的前提是，在轻量级锁被占用的整个同步周期内，不存在其他线程的竞争。若在该过程中一旦有其他线程竞争，那么就会膨胀成重量级锁，从而除了使用互斥量以外， 还额外发生了 CAS 操作， 因此更慢！

流程

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/013-e9882f43.jpg)

有偏向锁为什么还要用轻量级锁呢？

轻量级锁设计之初是为了应对线程之间交替获取锁的场景，而偏向锁的场景则是用于一个线程不断获取锁的场景。

通过源码我们可以看出当一个线程获取偏向锁后，这个锁就会永久偏向这个线程，因为一旦发生偏向锁撤销，就代表锁要升级成为轻量级锁。虽然偏向锁在加锁时会进行一次 cas 操作，但是后续的获取只会进行简单的判断，不会再进行 cas 操作。但是轻量级锁的加锁和释放都需要进行 cas 操作。

我们看下如果把轻量级锁使用在偏向锁的场景下对比：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/014-c835b12c.jpg)

我们可以看到轻量级锁情况下每次获取都需要进行加锁和释放，每次加锁和释放都会进行 cas 操作，所以单个线程获取锁的情况使用偏向锁效率更高。

在看下如果把偏向锁使用在轻量级锁的场景下对比：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/015-eadb7b04.jpg)

### 重量级锁

升级为重量级锁时，锁标志的状态值变为“10”，此时 Mark Word 中存储的是指向重量级锁的指针，此时等待锁的线程都会进入阻塞状态。

java 对象与 monitor 的关联图

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/016-aba2b324.jpg)

### 锁升级

整体的锁状态升级流程如下：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/017-d2f3f2f2.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/018-d2c07b49.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/019-62b67e1d.jpg)

### 锁粗化和锁消除

-   锁粗化就是将多个连续的加锁、解锁操作连接在一起，扩展成一个范围更大的锁，避免频繁的加锁解锁操作。
-   Java 虚拟机在 JIT 编译时（可以简单理解为当某段代码即将第一次被执行时进行编译，又称即时编译），通过对运行上下文的扫描，经过逃逸分析，去除不可能存在共享资源竞争的锁，通过这种方式消除没有必要的锁，可以节省毫无意义的请求锁时间

### 小结

偏向锁通过对比 Mark Word 解决加锁问题，避免执行 CAS 操作。而轻量级锁是通过用 CAS 操作和自旋来解决加锁问题，避免线程阻塞和唤醒而影响性能。重量级锁是将除了拥有锁的线程以外的线程都阻塞。

## 前知识-moniter 监视器

每个对象都存在着一个 Monitor 对象与之关联。执行 monitorenter 指令就是线程试图去获取 Monitor 的所有权，抢到了就是成功获取锁了；执行 monitorexit 指令则是释放了 Monitor 的所有权。

### ObjectMonitor 类

monitor 是用 c++实现的叫 objectmonitor。

java 实例对象里面记录了指向这个 monitor 的地址，这个 c++的 monitor 对象里面记录了当前持有这个锁的线程 id。

在 HotSpot 虚拟机中，Monitor 是基于 C++的 ObjectMonitor 类实现的，其主要成员包括：

-   \_owner：指向持有 ObjectMonitor 对象的线程
-   \_WaitSet：存放处于 wait 状态的线程队列，即调用 wait() 方法的线程
-   \_EntryList：存放处于等待锁 block 状态的线程队列
-   \_count：约为\_WaitSet 和 \_EntryList 的节点数之和
-   \_cxq: 多个线程争抢锁，会先存入这个单向链表
-   \_recursions: 记录重入次数

```
ObjectMonitor() {
    _header       = NULL;
    _count        = 0;
    _waiters      = 0,
    _recursions   = 0;  // 线程重入次数
    _object       = NULL;  // 存储 Monitor 对象
    _owner        = NULL;  // 持有当前线程的 owner
    _WaitSet      = NULL;  // wait 状态的线程列表
    _WaitSetLock  = 0 ;
    _Responsible  = NULL ;
    _succ         = NULL ;
    _cxq          = NULL ;  // 单向列表
    FreeNext      = NULL ;
    _EntryList    = NULL ;  // 处于等待锁状态 block 状态的线程列表
    _SpinFreq     = 0 ;
    _SpinClock    = 0 ;
    OwnerIsThread = 0 ;
    _previous_owner_tid = 0;
  }

```

更多源码分析 ，可以参考 这里。

### moniter 对象是什么时候实例化的？

在 Java 对象实例化的时候，ObjectMonitor 对象和 Java 对象一同创建和销毁。

### 协作

监视器 Monitor 有两种同步方式：互斥与协作。多线程环境下线程之间如果需要共享数据，需要解决互斥访问数据的问题，监视器可以确保监视器上的数据在同一时刻只会有一个线程在访问。

什么时候需要协作？比如：

> “
> 
> 一个线程向缓冲区写数据，另一个线程从缓冲区读数据，如果读线程发现缓冲区为空就会等待，当写线程向缓冲区写入数据，就会唤醒读线程，这里读线程和写线程就是一个合作关系。JVM 通过 Object 类的 wait 方法来使自己等待，在调用 wait 方法后，该线程会释放它持有的监视器，直到其他线程通知它才有执行的机会。一个线程调用 notify 方法通知在等待的线程，这个等待的线程并不会马上执行，而是要通知线程释放监视器后，它重新获取监视器才有执行的机会。如果刚好唤醒的这个线程需要的监视器被其他线程抢占，那么这个线程会继续等待。Object 类中的 notifyAll 方法可以解决这个问题，它可以唤醒所有等待的线程，总有一个线程执行。
> 
> ”

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/020-f7888503.jpg)

如上图所示，一个线程通过 1 号门进入 Entry Set（入口区），如果在入口区没有线程等待，那么这个线程就会获取监视器成为监视器的 Owner，然后执行监视区域的代码。如果在入口区中有其它线程在等待，那么新来的线程也会和这些线程一起等待。线程在持有监视器的过程中，有两个选择，一个是正常执行监视器区域的代码，释放监视器，通过 5 号门退出监视器；还有可能等待某个条件的出现，于是它会通过 3 号门到 Wait Set（等待区）休息，直到相应的条件满足后再通过 4 号门进入重新获取监视器再执行。

注意：

> “
> 
> 当一个线程释放监视器时，在入口区和等待区的等待线程都会去竞争监视器，如果入口区的线程赢了，会从 2 号门进入；如果等待区的线程赢了会从 4 号门进入。只有通过 3 号门才能进入等待区，在等待区中的线程只有通过 4 号门才能退出等待区，也就是说一个线程只有在持有监视器时才能执行 wait 操作，处于等待的线程只有再次获得监视器才能退出等待状态。
> 
> ”

### 其他问题

notify 执行之后立马唤醒线程吗？

其实 hotspot 里真正的实现是：退出同步块的时候才会去真正唤醒对应的线程；不过这个也是个默认策略，也可以改成在 notify 之后立马唤醒相关线程。

notify() 或者 notifyAll() 调用时并不会真正释放对象锁，必须等到 synchronized 方法或者语法块执行完才真正释放锁。

## synchronized 锁的是什么？

### Synchronized 原理

Synchronized 是 Java 中解决并发问题的一种最常用的方法，也是最简单的一种方法。

Synchronized 的作用主要有三个：

1.  确保线程互斥的访问同步代码
2.  保证共享变量的修改能够及时可见
3.  有效解决重排序问题。

从语法上讲，Synchronized 总共有三种用法：

1.  修饰普通方法
2.  修饰静态方法
3.  修饰代码块

我们将下面这段代码反编译看一下：

```java
public class SynchronizedDemo {

    public void syncDemoMethod(){

        synchronized (this){
            System.out.println("syncDemoMethod");
        }

    }
}

# 编译生成 class 文件 -g 生成所有调试信息
javac -g synchronizedDemo.java
# 反编译出字节码指令 -v 输出附加信息
javap -v synchronizedDemo

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/021-ac612711.jpg)

synchronized 实现的原理就在上图中的两条字节码指令中。下面是这两条指令的文档：

-   monitorenter (https://docs.oracle.com/javase/specs/jvms/se16/html/jvms-6.html#jvms-6.5.monitorenter)
-   monitorexit (https://docs.oracle.com/javase/specs/jvms/se16/html/jvms-6.html#jvms-6.5.monitorexit)

monitorenter

根据文档所述：

每个对象有一个监视器锁（monitor）。当且仅当 monitor 被占用时才会被锁定。执行 monitorenter 指令的线程尝试获取 monitor 的所有权，过程如下：

-   如果 monitor 的进入数为 0，则该线程进入 monitor，然后将进入数设置为 1，该线程即为 monitor 的所有者。
-   如果线程已经占有该 monitor，只是重新进入，则进入 monitor 的进入数加 1.
-   如果其他线程已经占用了 monitor，则该线程进入阻塞状态，直到 monitor 的进入数为 0，再重新尝试获取 monitor 的所有权。

monitorexit

根据文档所述：

-   执行 monitorexit 的线程必须是 objectref 所对应的 monitor 的所有者。
-   指令执行时，monitor 的进入数减 1，如果减 1 后进入数为 0，那线程退出 monitor，不再是这个 monitor 的所有者。其他被这个 monitor 阻塞的线程可以尝试去获取这个 monitor 的所有权。

synchronized 方法

```java
public class SynchronizedDemo {

    public synchronized void syncDemoMethod() {

        System.out.println("syncDemoMethod");

    }
}

```

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/022-bc821f41.jpg)

synchronized 方法的字节码指令没有中没有 `monitorenter` 和 `monitorexit` 。

syhchronized 方法的同步是一种隐式的方式来实现 ：当方法调用时，调用指令将会检查方法的 `ACC_SYNCHRONIZED` 访问标志是否被设置，如果设置了，执行线程将先获取 monitor，获取成功之后才能执行方法体，方法执行完后再释放 monitor。在方法执行期间，其他任何线程都无法再获得同一个 monitor 对象

多线程访问场景总结

1.  当两个并发线程访问同一个对象 object 中的这个 synchronized(this) 同步代码块时，一个时间内只能有一个线程得到执行。另一个线程必须等待当前线程执行完这个代码块以后才能执行该代码块。
2.  当一个线程访问 object 的一个 synchronized(this) 同步代码块时，另一个线程仍然可以访问该 object 中的非 synchronized(this) 同步代码块。
3.  当一个线程访问 object 的一个 synchronized(this) 同步代码块时，其他线程对 object 中所有其它 synchronized(this) 同步代码块的访问将被阻塞。
4.  当一个线程访问 object 的一个 synchronized(this) 同步代码块时，它就获得了这个 object 的对象锁。其它线程对该 object 对象所有同步代码部分的访问都被暂时阻塞。
5.  以上规则对其它对象锁同样适用。

需要特别说明：对于同一个类 A，线程 1 争夺 A 对象实例的对象锁，线程 2 争夺类 A 的类锁，这两者不存在竞争关系。

synchronized 阻塞线程的方式

-   synchronized 同步块对同一条线程来说是可重入的，不会出现自己锁死自己的情况
-   synchronized 同步块在已进入的线程执行完之前，会阻塞后面其他线程的进入，阻塞的方式是将 Java 的线程映射到操作系统的原生线程之上，通过操作系统来阻塞或唤醒一条线程。

借用操作系统意味着需要从用户态转换到核心态，状态转换会耗费很多的处理器时间，因此 synchronized 是一个重量级操作。通常，虚拟机自身会对其做一些优化，比如在通知操作系统阻塞线程之前加入一段自旋等待过程，避免频繁切入到核心态。

小结

JVM 规范规定 JVM 基于进入和退出 Monitor 对象来实现方法同步和代码块同步，但两者的实现细节不一样。

-   代码块同步是使用`monitorenter`和`monitorexit`字节码指令实现
-   方法同步是 根据该 `ACC_SYNCHRONIZED`标示符来实现

`monitorenter`指令是在编译后插入到同步代码块的开始位置，而`monitorexit`是插入到方法结束处和异常处， JVM 要保证每个`monitorenter`必须有对应的 monitorexit 与之配对。

任何对象都有一个 `monitor` 与之关联，当且一个`monitor` 被持有后，它将处于锁定状态。线程执行到 `monitorenter` 指令时，将会尝试获取对象所对应的 `monitor` 的所有权，即尝试获得对象的锁。

### 总结

我们通过分析 JAVA 对象的内存布局了解了`对象头`，顺藤摸瓜了解了 `markword`的结构 以及 objectMonitor（监视器）。

从 `markword` 中认识了与`锁` 相关的重要信息，了解到锁的类型和区别以及锁相关的优化和升级过程。

从 `ObjectMonitor` 了解到它是  `synchronized`  的核心实现，以及对于线程协作上的具体逻辑。

从 `synchronized` 所修饰的代码的字节码指令中分析出 `monitorenter` 和 `monitorexit`  指令，它又与我们上面了解到的 `objectMonitor` 密不可分。

同时总结出了 `synchronized` 的使用场景以及线程协作时的常见问题  。利用总结的知识，围绕问题较全面地回答了 “synchronized 锁的是什么？”

## 为什么 wait() 和 notify() 需要搭配 synchonized 关键字使用 ？

### 剖析

```java
  public static void main(String[] args) {

        SynchronizedDemo obj = new SynchronizedDemo();
        obj.notify();
    }

```

如果我们直接执行对象的 notify/wait 等方法时会报错，报错信息如下：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/023-f7d7e73a.jpg)

这里显示异常类型为： `IlleagalMonitorStateException`

我们看一下 JDK 对方法的注释

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2022-02-15-synchronized-suo-de-shi-shen-me/024-f84afc40.jpg)

意思是同一时刻只有一个线程可以获得对象的监视器锁（monitor），如果当前线程没有获得对象的监视器锁则抛出 `IlleagalMonitorStateException`   异常。

表明如果我们直接调用 wait/notify 等方法是不能获得监视器锁的，只有先获得监视器锁才行，所以在使用 wait/notify 等方法时要配合 `synchronized`  先获得监视器锁（monitor），然后调用这些方法。

而一个线程获得对象监视器锁有三种方法，也就是加 `synchronized` 的三种方式：

-   修饰普通方法
-   synchronized 代码块
-   修饰静态方法（给类加锁）

## 参考

-   https://blog.csdn.net/qq\_36434742/article/details/106854061
-   http://chickenman.cn/archives/708
-   https://www.zhihu.com/question/52116998
-   https://www.cnblogs.com/LemonFive/p/11248248.html
-   https://www.zhihu.com/question/55075763
-   https://www.heapdump.cn/article/2966044
-   https://tech.meituan.com/2018/11/15/java-lock.html
-   https://tech.youzan.com/javasuo-yu-xian-cheng-de-na-xie-shi/
-   https://xiaomi-info.github.io/2020/03/24/synchronized/
-   https://www.cnblogs.com/aspirant/p/11470858.html
-   https://www.zhihu.com/question/57794716
-   https://www.cnblogs.com/paddix/p/5367116.html
