---
title: "经典面试题之HashMap(二)"
slug: 2020-03-27-jing-dian-mian-shi-ti-zhi-hashmap-er
description: "接上文 经典面试题之HashMap(一)三 不考虑内存限制，HashMap可以无限存储数据吗？不可以，Has"
date: 2020-03-27T02:17:46.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-27-jing-dian-mian-shi-ti-zhi-hashmap-er/cover.jpg
original_url: https://mp.weixin.qq.com/s/PUgh3J9pDGRnTVgGyqcjVg
categories:
  - 行业与思考
tags:
  - Nginx
  - 数据结构
  - 面试
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-27-jing-dian-mian-shi-ti-zhi-hashmap-er/001-a8f5f44a.jpg)

接上文 [经典面试题之HashMap(一)](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484239&idx=1&sn=370298f66cfb9b85df7420cb09a5ce2e&chksm=eb6dbcc9dc1a35df77495c0718c3b59f6eae1eef449ab3f0ad23884533a8173de073458cf2d3&scene=21#wechat_redirect)

## 三 不考虑内存限制，HashMap可以无限存储数据吗？

不可以，HashMap是有最大容量上限的。我们还是来看下源码注释：

```cs
/**
     * The maximum capacity, used if a higher value is implicitly specified
     * by either of the constructors with arguments.
     * MUST be a power of two <= 1<<30.
     */
    static final int MAXIMUM_CAPACITY = 1 << 30;

```

很明显，如果构造函数传入的值大于MAXIMUM\_CAPACITY ，那么替换成该数 MAXIMUM\_CAPACITY 是 1 << 30 即 2的30次方。

**为什么是1 << 30？  1 <<31 不行吗？**

注意看这个值是int 类型的。我们知道int 的极限最大值 Integer.*MAX\_VALUE 是2的31次方减1，即*2147483647，如果 1 << 30 改为 1 << 31 ，由于int是有符号数，这个值将为 -2147483648，而且hashMap的容量都是2的整数次幂，也就只能是2的30次方了。**然而这并不是HashMap的最大容量。**

来看下HashMap的构造函数

```cs
 public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity);
    }

```

上面代码中有一句 

```makefile
if (initialCapacity > MAXIMUM_CAPACITY)
initialCapacity = MAXIMUM_CAPACITY;

```

如果我要存的数目大于 MAXIMUM\_CAPACITY，你还把我的容量缩小成 MAXIMUM\_CAPACITY？其实不是的，在resize()方法中有一句

```nginx
 if (oldCap >= MAXIMUM_CAPACITY) {
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }

```

**在这里我们可以看到其实** **hashmap的“最大容量“是Integer.MAX\_VALUE****;** 

**threshold=capacity\*loadFactor threshold 表示当HashMap的size大于threshold时会执行resize操作。size就是HashMap中实际存在的键值对数量。**

**思考题：如果到达了HashMap的容量上限，再继续添加元素，会怎样？** 

其实你可以计算一下，当HashMap到达容量上限后占用的内存大小，已经很大了，所以一般情况下是内存溢出，我们在日常使用时，一般情况下不会把那么大的数据全部放到一个HashMap中。然而如果不考虑内存溢出的情况，就是你有一个超大的内存，那这个时候会怎样？

## 四 如何确定哈希桶数组索引位置？

我们首先想到的就是把hash值对数组长度取模运算，这样一来，元素的分布相对来说是比较均匀的。但是，模运算的消耗还是比较大的，在HashMap中是这样做的：调用下面的代码来计算该对象应该保存在table数组的哪个索引处。

```cs
static int indexFor(int h, int length) {  
    //jdk1.7的源码，jdk1.8没有这个方法，但是实现原理一样的
     return h & (length-1);  //第三步 取模运算
}

```

这个方法非常巧妙，它通过h & (table.length -1)来得到该对象的保存位，而HashMap底层数组的长度总是2的n次方，这是HashMap在速度上的优化。当length总是2的n次方时，h& (length-1)运算等价于对length取模，也就是h%length，但是&比%具有更高的效率。

注意  **h& (length-1)** **当且仅当length(即capacity)是2的整倍数****的时候才等于 h % length** ,**从这个角度也说明了capacity为什么一定要****用2的整次幂。**

数组长度-1 正好相当于一个“低位掩码”。“与”操作的结果就是散列值的高位全部归零，只保留低位值，用来做数组下标访问。以初始长度16为例，16-1=15。2进制表示是00000000 00000000 00001111。和某散列值做“与”操作如下，结果就是截取了最低的四位值。

![Image](002-17d841f3.png "image.png")

##

## 五 了解HashMap的hash函数吗？

我们先来说说hash算法的一般实现：

-   大数变小数-->取模

-   让结果的规律性不明显--> 异或、改变原始数据、移位

-   碰撞是存在的，主要是看解决碰撞的方案

**java中常用的hashCode算法**

-   Object类的hashCode。返回对象的经过处理后的内存地址。由于每个对象的内存地址都不一样，所以哈希码也不一样，这是个native方法。取决于JVM的内部设计，一般是某种C地址的偏移。

-   String 类的hashCode,根据String类包含的字符串的内容，根据一种特殊的算法返回哈希码，只要字符串的内容相同，返回的哈希码也相同。

-   Integer 等包装类，返回的哈希码就是Integer对象里所包含的那个整数的值，例如 Integer  i1 = new Integer(100), i1.hashCode() 的值就是 100。由此可见，两个一样大小的Integer对象，返回的哈希码也一样。

-   int、char这样的基础类，它们不需要hashCode,如果需要存储时，将进行自动装箱操作，计算方法同上。

我们来看下HashMap中的hash算法是如何实现的：

```java
 static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }

```

hash(Object key)的作用就是重新计算hash值。

**HashMap中为什么不直接用key.hashCode()获取哈希值，而是使用(h = key.hashCode()) ^ (h >>> 16)？**

我们通过上文了解了HashMap如何计算出数组索引位置，但其实有一个问题，就是即使我的散列值分布再松散，要是只取最后几位的话，碰撞也会很严重。更要命的是如果散列本身做得不好，分布上成等差数列的漏洞，恰好使最后几个低位呈现规律性重复，就无比蛋疼。

这时候“扰动函数”的价值就体现出来了

![Image](003-cd3b7fc8.png "image.png")

**右位移16位，正好是****32bi****t的一半，****自己的高半区和低半区做异或，就是为了混合原始哈希码的高位和低位，以此来加大低位的随机性****。****而且混合后的低位掺杂了高位的部分特征，这样高位的信息也被变相保留下来**。这么做可以在数组table的length比较小的时候，也能保证考虑到高低Bit都参与到Hash的计算中，同时不会有太大的开销。（JDK 7做了4次右移，估计是边际效应的原因，JDK8就只做了一次右移）

总结 ：(h = key.hashCode()) ^ (h >>> 16)这样写有点类似重写了hashCode，确保得出的数足够的随机，因为进行hash计算的时候 确保它的数足够的分散，以便于计算数组下标的时候存放的值足够分散。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-27-jing-dian-mian-shi-ti-zhi-hashmap-er/004-683106fa.jpg)

关注公众号 获取更多精彩内容
