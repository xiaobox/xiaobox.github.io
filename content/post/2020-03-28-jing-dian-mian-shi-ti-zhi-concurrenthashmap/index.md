---
title: "经典面试题之ConcurrentHashMap"
slug: 2020-03-28-jing-dian-mian-shi-ti-zhi-concurrenthashmap
description: "一  ConcurrentHashMap 与 HashMap的区别？ConcurrentHashMap线程安"
date: 2020-03-28T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-28-jing-dian-mian-shi-ti-zhi-concurrenthashmap/cover.jpg
original_url: https://mp.weixin.qq.com/s/UGrpvrjbhMJq0io9dAa4BA
categories:
  - 行业与思考
tags:
  - Java
  - JVM
  - Python
  - 数据结构
  - 面试
  - 多线程
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-28-jing-dian-mian-shi-ti-zhi-concurrenthashmap/001-f531c5b9.jpg)

## 一  ConcurrentHashMap 与 HashMap的区别？

-   ConcurrentHashMap线程安全，而HashMap非线程安全

-   HashMap允许Key和Value为null，而ConcurrentHashMap不允许

-   HashMap不允许通过Iterator遍历的同时通过HashMap修改，而ConcurrentHashMap允许该行为，并且该更新对后续的遍历可见

以上说的比较笼统，我们具体看一下ConcurrentHashMap：

**先来看下ConcurrentHashMap的数据结构**

**1.8之前**的 ConcurrentHashMap是在1.7HashMap的基础上实现了线程安全的版本。采用分段锁的概念，使锁更加细化。它默认将Hash表分为16个分段，segments数组的长度最大为65536，最大容量 1 << 30。

![Image](002-f4ea7889.png "image.png")

**JDK1.8** 的实现已经摒弃了 Segment 的概念，而是直接用 Node 数组 + 链表 + 红黑树的数据结构来实现，并发控制使用 **Synchronized 和 CAS** 来操作，整个看起来就像是优化过且线程安全的 HashMap，虽然在 JDK1.8 中还能看到 Segment 的数据结构，但是已经简化了属性，只是为了兼容旧版本。

![Image](003-74625ba9.png "image.png")

## 二 concurrentHashMap最大容量？

```cs
/**
     * The largest possible table capacity.  This value must be
     * exactly 1<<30 to stay within Java array allocation and indexing
     * bounds for power of two table sizes, and is further required
     * because the top two bits of 32bit hash fields are used for
     * control purposes.
     */
    private static final int MAXIMUM_CAPACITY = 1 << 30;

```java

**注意这是** The largest possible table capacity，它是否代表最多能存储到map中的元素数量？答案是否定的。至于为什么，作为思考题，留给你。（关于这个问题在前一个系列关于HashMap的文章中也提到过相似的问题）

提示 看一下size方法，为什么n要设计为long？实际元素数量和返回值一样吗？ 

```cs
public int size() {
        long n = sumCount();
        return ((n < 0L) ? 0 :
                (n > (long)Integer.MAX_VALUE) ? Integer.MAX_VALUE :
                (int)n);
    }

```

## 三 ConcurrentHashMap 也会出现死循环？

是的，当你不当地使用computeIfAbsent 方法时

```python
/**
     * If the specified key is not already associated with a value,
     * attempts to compute its value using the given mapping function
     * and enters it into this map unless {@code null}.  The entire
     * method invocation is performed atomically, so the function is
     * applied at most once per key.  Some attempted update operations
     * on this map by other threads may be blocked while computation
     * is in progress, so the computation should be short and simple,
     * and must not attempt to update any other mappings of this map.

```

上面的computeIfAbsent 方法注释也得很清楚了，**应该绝对避免在computeIfAbsent中有递归，或者修改map的任何操作。所以如果你在调用此方法并有上述操作时就会出现死循环问题。**至于为什么会出现这种问题，有兴趣的可以读读其他资料或源代码，本文就不详述了。好在这个问题在java 1.9中已经基本修复了。

（ https://bugs.openjdk.java.net/browse/JDK-8172951 ）

问题如何规避？既然官方给出这么强烈的提示了，不作死就不会死。或者升级到JDK1.9

## 四 ConcurrentHashMap 在 JDK 1.8 中，为什么要使用内置锁 synchronized 来代替重入锁 ReentrantLock？

-   粒度降低了(看下图感觉下锁粒度的变化)

-   JVM 开发团队没有放弃 synchronized，而且基于 JVM 的 synchronized 优化空间更大，更加自然。

-   在大量的数据操作下，对于 JVM 的内存压力，基于 API 的 ReentrantLock 会开销更多的内存。

![Image](004-42bec28d.png "image.png")

![Image](005-c29b02e2.png "image.png")

JDK1.8的ConcurrentHashMap（TreeBin: 红黑二叉树节点

Node: 链表节点）

![Image](006-7bbbf4a1.png "image.png")

## 五  put() 方法流程？ 

```cs
final V putVal(K key, V value, boolean onlyIfAbsent) {
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
        for (Node<K,V>[] tab = table;;) {
            Node<K,V> f; int n, i, fh;
            if (tab == null || (n = tab.length) == 0)
                tab = initTable();
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
                if (casTabAt(tab, i, null,
                             new Node<K,V>(hash, key, value, null)))
                    break;                   // no lock when adding to empty bin
            }
            else if ((fh = f.hash) == MOVED)
                tab = helpTransfer(tab, f);
            else {
                V oldVal = null;
                synchronized (f) {
                    if (tabAt(tab, i) == f) {
                        if (fh >= 0) {
                            binCount = 1;
                            for (Node<K,V> e = f;; ++binCount) {
                                K ek;
                                if (e.hash == hash &&
                                    ((ek = e.key) == key ||
                                     (ek != null && key.equals(ek)))) {
                                    oldVal = e.val;
                                    if (!onlyIfAbsent)
                                        e.val = value;
                                    break;
                                }
                                Node<K,V> pred = e;
                                if ((e = e.next) == null) {
                                    pred.next = new Node<K,V>(hash, key,
                                                              value, null);
                                    break;
                                }
                            }
                        }
                        else if (f instanceof TreeBin) {
                            Node<K,V> p;
                            binCount = 2;
                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                           value)) != null) {
                                oldVal = p.val;
                                if (!onlyIfAbsent)
                                    p.val = value;
                            }
                        }
                    }
                }
                if (binCount != 0) {
                    if (binCount >= TREEIFY_THRESHOLD)
                        treeifyBin(tab, i);
                    if (oldVal != null)
                        return oldVal;
                    break;
                }
            }
        }
        addCount(1L, binCount);
        return null;
    }

```

1.  如果没有初始化，就调用 initTable() 方法来进行初始化；

2.  如果没有 hash 冲突就直接 CAS 无锁插入；

3.  如果需要扩容，就先进行扩容；

4.  如果存在 hash 冲突，就加锁来保证线程安全，两种情况：一种是链表形式就直接遍历到尾端插入，一种是红黑树就按照红黑树结构插入；

5.  如果该链表的数量大于阀值 8，就要先转换成红黑树的结构，break 再一次进入循环

6.  如果添加成功就调用 addCount() 方法统计 size，并且检查是否需要扩容。

-   扩容方法 transfer()：默认容量为 16，扩容时，容量变为原来的两倍。

-   helpTransfer()：调用多个工作线程一起帮助进行扩容，这样的效率就会更高。

# **六 ConcurrentHashMap 的并发度是什么？**

程序运行时能够同时更新 ConccurentHashMap 且不产生锁竞争的最大线程数。默认为 16，且可以在构造函数中设置。当用户设置并发度时，ConcurrentHashMap 会使用大于等于该值的最小2幂指数作为实际并发度（假如用户设置并发度为17，实际并发度则为32）

## 七  ConcurrentHashMap的get方法是否要加锁，为什么？

不需要。get没有加锁的话，ConcurrentHashMap是如何保证读到的数据不是脏数据的呢？

get操作全程不需要加锁是因为Node的成员val是用volatile修饰的。

## 八 ConcurrentHashMap 如何计算 size

**size()方法返回的是一个不精确的值**

我们先来看一下jdk1.8的代码注释：

**大致的意思是：返回容器的大小。这个方法应该被用来代替size()方法，因为 ConcurrentHashMap的容量大小可能会大于int的最大值。返回的值是一个估计值;如果有并发插入或者删除操作，则实际的数量可能有所不同。**

```java
/**
     * Returns the number of mappings. This method should be used
     * instead of {@link #size} because a ConcurrentHashMap may
     * contain more mappings than can be represented as an int. The
     * value returned is an estimate; the actual count may differ if
     * there are concurrent insertions or removals.
     *（大致的意思是：返回容器的大小。这个方法应该被用来代替size()方法，因为
     * ConcurrentHashMap的容量大小可能会大于int的最大值。
     * 返回的值是一个估计值;如果有并发插入或者删除操作，则实际的数量可能有所不同。）
     * @return the number of mappings
     * @since 1.8
     */
    public long mappingCount() {
        long n = sumCount();
        return (n < 0L) ? 0L : n; // ignore transient negative values
    }

```

**1.7**中 Segment继承ReentrantLock，这样就很容易对每个Segment加锁了。类似于get或remove这些操作，都只需要在操作前对一个Segment加锁。但是有些操作需要跨段，比如size()、containsValue()和isEmpty()方法，因此为了保证并发效率，**允许size返回的是一个近似值而不是精确值。**

**1.7**的 put、remove和get操作只需要关心一个Segment，而size操作需要遍历所有的Segment才能算出整个Map的大小。一个简单的方案是，先锁住所有Sgment，计算完后再解锁。但这样做，在做size操作时，不仅无法对Map进行写操作，同时也无法进行读操作，不利于对Map的并行操作。为更好支持并发操作，**ConcurrentHashMap会在不上锁的前提逐个Segment计算3次size，**如果某相邻两次计算获取的所有Segment的更新次数（每个Segment都与HashMap一样通过modCount跟踪自己的修改次数，Segment每修改一次其modCount加一）相等，说明这两次计算过程中无更新操作，则这两次计算出的总size相等，可直接作为最终结果返回。如果这三次计算过程中Map有更新，则对所有Segment加锁重新计算Size。

**jdk 1.8** put方法和remove方法都会通过addCount方法维护Map的size。size方法通过sumCount获取由addCount方法维护的Map的size。

```cs
 final long sumCount() {
        CounterCell[] as = counterCells; CounterCell a;
        long sum = baseCount;
        if (as != null) {
            for (int i = 0; i < as.length; ++i) {
                if ((a = as[i]) != null)
                    sum += a.value;
            }
        }
        return sum;
    }

 private final void addCount(long x, int check) {
        CounterCell[] as; long b, s;
        if ((as = counterCells) != null ||
            !U.compareAndSwapLong(this, BASECOUNT, b = baseCount, s = b + x)) {
            CounterCell a; long v; int m;
            boolean uncontended = true;
            if (as == null || (m = as.length - 1) < 0 ||
                (a = as[ThreadLocalRandom.getProbe() & m]) == null ||
                !(uncontended =
                  U.compareAndSwapLong(a, CELLVALUE, v = a.value, v + x))) {
                fullAddCount(x, uncontended);
                return;
            }
            if (check <= 1)
                return;
            s = sumCount();
        }

```

注意两个属性 ：baseCount 和 counterCells。

-   baseCount 一个 volatile 的变量，在 addCount 方法中会使用它，而 addCount 方法在 put 结束后会调用。在 addCount 方法中，会对这个变量做 CAS 加法。

-   counterCells 一种用于分配计数的填充单元。改编自LongAdder和Striped64

### 总结

-   JDK1.7 和 JDK1.8 对 size 的计算是不一样的。1.7 中是先不加锁计算三次，如果三次结果不一样在加锁

-   JDK1.8 size 是通过对 baseCount 和 counterCell 进行 CAS 计算，最终通过 baseCount 和 遍历 CounterCell 数组得出 size。

-   JDK 8 推荐使用mappingCount 方法，因为这个方法的返回值是 long 类型，不会因为 size 方法是 int 类型限制最大值。

## 九 用了ConcurrentHashMap 就一定是线程安全的吗？

不一定，ConcurrenetHashMap 只能保证提供的原子性读写操作是线程安全的，换句话说，如果你的读写操作不是原子性的，那么无法保证绝对的线程安全。如果你希望在一整段业务逻辑中，对容器的操作都保持整体一致性的话，需要另外加锁处理。

**ConcurrentHashMap 对外提供的方法或能力的限制：**

-   使用了 ConcurrentHashMap，不代表对它的多个操作之间的状态是一致的，是没有其他线程在操作它的，如果需要确保需要手动加锁。

-   诸如 size、isEmpty 和 containsValue 等聚合方法，在并发情况下可能会反映 ConcurrentHashMap 的中间状态。因此在并发情况下，这些方法的返回值只能用作参考，而不能用于流程控制。

-   诸如 putAll 这样的聚合方法也不能确保原子性，在 putAll 的过程中去获取数据可能会获取到部分数据。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-28-jing-dian-mian-shi-ti-zhi-concurrenthashmap/007-04ecede2.jpg)

关注公众号 获取更多精彩内容
