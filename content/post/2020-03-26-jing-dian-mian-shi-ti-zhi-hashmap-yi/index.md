---
title: "经典面试题之HashMap(一)"
slug: 2020-03-26-jing-dian-mian-shi-ti-zhi-hashmap-yi
date: 2020-03-26T08:43:45.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-26-jing-dian-mian-shi-ti-zhi-hashmap-yi/cover.jpg
original_url: https://mp.weixin.qq.com/s/PTeSMRqRoOcbgfnLotiRpw
categories:
  - 行业与思考
tags:
  - JavaScript
  - 数据结构
  - 面试
  - 网络
---
##

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-26-jing-dian-mian-shi-ti-zhi-hashmap-yi/001-a8f5f44a.jpg)

## 一 HashMap的loadFactor为什么是0.75？

先说一下什么是loadFactor ：

loadFactor即装载因子，装载因子的计算公式是：**散列表的装载因子 =  填入表中的元素个数 / 散列表长度**，如果有人问你0.75的分子分母是什么，依据这个公式回答就可以了。一般情况下，我们会尽可能保证散列表中有一定比例的空闲槽位。我们用装载因子来表示空位的多少。

**装载因子越大，说明空闲位置越少，冲突越多，散列表的性能会下降**。所以如果装载因子是1，显然不合适。

**那如果是0.5呢？**如果是0.5 ， 那么每次达到容量的一半就进行扩容，默认容量是16， 达到8就扩容成32，达到16就扩容成64， 最终使用空间和未使用空间的差值会逐渐增加，空间利用率低下，也不合适。

**那为什么是0.75？**

我们来看看源码注释

```javascript
  * Because TreeNodes are about twice the size of regular nodes, we
     * use them only when bins contain enough nodes to warrant use
     * (see TREEIFY_THRESHOLD). And when they become too small (due to
     * removal or resizing) they are converted back to plain bins.  In
     * usages with well-distributed user hashCodes, tree bins are
     * rarely used.  Ideally, under random hashCodes, the frequency of
     * nodes in bins follows a Poisson distribution
     * (http://en.wikipedia.org/wiki/Poisson_distribution) with a
     * parameter of about 0.5 on average for the default resizing
     * threshold of 0.75, although with a large variance because of
     * resizing granularity. Ignoring variance, the expected
     * occurrences of list size k are (exp(-0.5) * pow(0.5, k) /
     * factorial(k)). The first values are:
     *
     * 0:    0.60653066
     * 1:    0.30326533
     * 2:    0.07581633
     * 3:    0.01263606
     * 4:    0.00157952
     * 5:    0.00015795
     * 6:    0.00001316
     * 7:    0.00000094
     * 8:    0.00000006
     * more: less than 1 in ten million

```html

你可能看过注释或听说过泊松分布，如果不知道的，可以看这里（http://www.ruanyifeng.com/blog/2015/06/poisson-distribution.html#comment-356111）简单学习一下。不过上面这段注释**没有解释load factory默认值是0.75的原因**，而是说load factor的值会影响泊松分布PMF函数公式中的参数λ的值。例如load factor=0.75f时λ=0.5。按照泊松分布公式来看，期望放入bin中数据的数量k=8，e是一个无理常数，λ的值受load factor的值的影响。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-26-jing-dian-mian-shi-ti-zhi-hashmap-yi/002-ae9c6ff2.png)

**DEFAULT\_LOAD\_FACTOR =0.75f的真正原因是什么？**

我们还是回到源码注释中，来看这一段：

```kotlin
* <p>As a general rule, the default load factor (.75) offers a good
 * tradeoff between time and space costs.  Higher values decrease the
 * space overhead but increase the lookup cost (reflected in most of
 * the operations of the <tt>HashMap</tt> class, including
 * <tt>get</tt> and <tt>put</tt>).  The expected number of entries in
 * the map and its load factor should be taken into account when
 * setting its initial capacity, so as to minimize the number of
 * rehash operations.  If the initial capacity is greater than the
 * maximum number of entries divided by the load factor, no rehash
 * operations will ever occur.

```

简单翻译下：

> 通常，默认负载因子（.75）在时间和空间成本之间提供了一个很好的权衡。较高的值会减少空间开销，但会增加查找成本（在HashMap类的大多数操作中都得到体现，包括get和put）。设置其初始容量时，应考虑映射中的预期条目数及其负载因子，以最大程度地减少重新哈希操作的数量。如果初始容量大于最大条目数除以负载因子，则不会发生任何哈希操作。

**所以，0.75只是一个折中的选择，和泊松分布没有什么关系**

再有，根据HashMap的扩容机制  capacity 是2的幂，我们用 loadFactor \* capacity 的结果就正好是一个整数，所以从这个角度来说0.75也是比较合适的。

## 二  HashMap的数据结构是什么？

jdk1.7 是数组+链表的结构 ，jdk1.8是数组+链表+红黑树

如图所示，为1.7版本的

![Image](003-2fbbe7ff.png "image.png")

下图为1.8版本的：

![Image](004-fd0d52a1.png "image.png")

在jdk1.8之后，HashMap初始化的时候也是线性表+链表，只是当**链表的长度超过一定数量之后，会把链表转换成红黑树****来增加代码运行时的性能**。在源码中用TREEIFY\_THRESHOLD这个参数来指定这个数量。

TREEIFY\_THRESHOLD的值为8。

```cs
/**
     * The bin count threshold for using a tree rather than list for a
     * bin.  Bins are converted to trees when adding an element to a
     * bin with at least this many nodes. The value must be greater
     * than 2 and should be at least 8 to mesh with assumptions in
     * tree removal about conversion back to plain bins upon
     * shrinkage.
     */
    static final int TREEIFY_THRESHOLD = 8;
/**
     * The bin count threshold for untreeifying a (split) bin during a
     * resize operation. Should be less than TREEIFY_THRESHOLD, and at
     * most 6 to mesh with shrinkage detection under removal.
     */
    static final int UNTREEIFY_THRESHOLD = 6;

```

我们注意到上面源码注释中还有一个值 UNTREEIFY\_THRESHOLD，它是一个**红黑树到链表的还原阈值**，当扩容时，桶中元素个数小于这个值，就会把树形的桶元素 还原（切分）为链表结构。把时间复杂度从O（n）变成O（logN）提高了效率）

**那么，为什么是8和6这两个数字？**

如果选择6和8（如果链表小于等于6树还原转为链表，大于等于8转为树），中间有个差值7可以有效防止链表和树频繁转换。假设一下，如果设计成链表个数超过8则链表转换成树结构，链表个数小于8则树结构转换成链表，如果一个HashMap不停的插入、删除元素，链表个数在8左右徘徊，就会频繁的发生树转链表、链表转树，效率会很低。

**那8是怎么来的？**

还记得上文说的泊松分布吗？我们把源码注释再拿来看一看

```javascript
* Because TreeNodes are about twice the size of regular nodes, we
     * use them only when bins contain enough nodes to warrant use
     * (see TREEIFY_THRESHOLD). And when they become too small (due to
     * removal or resizing) they are converted back to plain bins.  In
     * usages with well-distributed user hashCodes, tree bins are
     * rarely used.  Ideally, under random hashCodes, the frequency of
     * nodes in bins follows a Poisson distribution
     * (http://en.wikipedia.org/wiki/Poisson_distribution) with a
     * parameter of about 0.5 on average for the default resizing
     * threshold of 0.75, although with a large variance because of
     * resizing granularity. Ignoring variance, the expected
     * occurrences of list size k are (exp(-0.5) * pow(0.5, k) /
     * factorial(k)). The first values are:
     *
     * 0:    0.60653066
     * 1:    0.30326533
     * 2:    0.07581633
     * 3:    0.01263606
     * 4:    0.00157952
     * 5:    0.00015795
     * 6:    0.00001316
     * 7:    0.00000094
     * 8:    0.00000006
     * more: less than 1 in ten million

```

我们用白话文翻译一下，大概意思就是说：

> **因为树结构是链表结构的两倍大小左右，所以当节点足够多的时候我们才会转换为树结构存储，而当它节点足够少的时候，我们又从树结构转换为链表结构。当使用良好的哈希码时，树结构是很少使用到的，理想的情况下，在随机的哈希码下，节点在链表中出现的频率符合泊松分布，在数组调整阈值为0.75的时候，该泊松分布的平均参数约为0.5，因为数组调整的阈值大小对平均参数有很大影响。如果忽略这个影响，列表长度k出现的次数按照泊松分布依次为：**
> 
> **0: 0.60653066；**
> 
> **1: 0.30326533；**

> **2: 0.07581633；**

> **3: 0.01263606；**

> **4: 0.00157952；**

> **5: 0.00015795；**

> **6: 0.00001316；**

> **7: 0.00000094；**

> **8: 0.00000006；**

> **更大：不足千万分之一；**

因为长度出现8的概率已经足够足够小了，所以说，按照泊松分布，大部分的HashMap其实还是数组+链表结果，不会转换为红黑树。当链表长度为8的时候，概率的计算，就是把8带入到公式中，因为默认调整阈值是0.75的时候，平均值是0.5，所以，求得的概率即为链表长度为8的概率。

**总结 ：容器中节点分布在hash桶中的频率遵循泊松分布，桶的长度超过8的概率非常非常小。所以作者应该是根据概率统计而选择了8作为阀值。**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-26-jing-dian-mian-shi-ti-zhi-hashmap-yi/005-1e73da81.jpg)

关注公众号 获取更多精彩内容
