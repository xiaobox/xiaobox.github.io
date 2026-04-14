---
title: "一次性搞定HashMap面试"
slug: 2020-03-27-yi-ci-xing-gao-ding-hashmap-mian-shi
description: "本文是hashMap系列的最后一篇文章，如果您觉得写得还不错的话，请关注本公众号接上文经典面试题之HashM"
date: 2020-03-27T16:00:00.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-27-yi-ci-xing-gao-ding-hashmap-mian-shi/cover.jpg
original_url: https://mp.weixin.qq.com/s/DlOD1ZKYbMXz6jSJmrIMbw
categories:
  - 行业与思考
tags:
  - 数据结构
  - 面试
  - 网络
  - DevOps
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-27-yi-ci-xing-gao-ding-hashmap-mian-shi/001-a8f5f44a.jpg)

本文是hashMap系列的最后一篇文章，如果您觉得写得还不错的话，请关注本公众号![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-27-yi-ci-xing-gao-ding-hashmap-mian-shi/002-bb56a052.png)

接上文

[经典面试题之HashMap(一)](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484239&idx=1&sn=370298f66cfb9b85df7420cb09a5ce2e&chksm=eb6dbcc9dc1a35df77495c0718c3b59f6eae1eef449ab3f0ad23884533a8173de073458cf2d3&scene=21#wechat_redirect)

[经典面试题之HashMap(二)](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484244&idx=1&sn=6df3488ca359fac892456fabdeb6520a&chksm=eb6dbcd2dc1a35c406ff444c029edb87aa8db8abc83b9e53dde392b113c3093cf3187cf25342&scene=21#wechat_redirect)

## 六 HashMap是如何解决hash冲突的

解决哈希冲突的方法一般有：开放定址法、链地址法（拉链法）、再哈希法、建立公共溢出区等方法。

HashMap是用**拉链法**解决的Hash冲突问题。HashMap的数据结构 ，前两篇文章有介绍过，jdk1.7 是数组+链表的结构 ，jdk1.8是数组+链表+红黑树。正是为了解决Hash冲突以及平衡查询、插入等操作的效率HashMap的作者才将HashMap设计成这种数据结构

我们来具体看一下put方法的源码(jdk1.8)，通过这个过程了解下如何解决冲突

```cs
/**
     * Implements Map.put and related methods.
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to put
     * @param onlyIfAbsent if true, don't change existing value
     * @param evict if false, the table is in creation mode.
     * @return previous value, or null if none
     */
    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        
        //tab为空则创建
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        //计算index，并对null做处理 
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {
            Node<K,V> e; K k;
            //节点key存在，直接覆盖value
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            //判断该链为红黑树
            else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                //该链为链表
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        //链表长度大于8转换为红黑树进行处理
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    //key已经存在直接覆盖value
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        //超过最大容量 就扩容
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }

```

HashMap的put方法执行过程可以通过下图来理解

![Image](003-fe77c484.png "image.png")

通过上图和源码注释，我们了解了put方法的执行过程，其中在这一行：

```javascript
if ((p = tab[i = (n - 1) & hash]) == null)

```

计算 index，并对 null 做处理，如果不为 null ,则表明 tab 的这个 i 位置上已经有数据了，**hash冲突就发生在了这里**。从这里的else条件开始就是hashMap解决hash冲突的过程。也就是所谓的“拉链法”。

**这里有几个需要注意的点：**

-   HashMap采用的链表法的方式，链表是**单向链表**

-   当发生hash冲突，hashMap的桶中形成链表的时候，新的元素插入到该链表的时候，**jdk1.7使用的是“头插法” 即新元素在链表头，而jdk1.8使用的“尾插法” 即新元素在链表尾**。

-   在多线程使用场景中，应该尽量避免使用线程不安全的HashMap，而使用线程安全的ConcurrentHashMap

思考题：jdk1.8为什么改头插法为尾插法？

关于上面第三点，其中有个著名的例子，就是在多线程环境下使用HashMap可能产生**环链（死循环）问题**，当然是在jdk1.7版本，jdk1.8由于使用了“尾插法”就避免了这个问题。在使用jdk1.7的情况下，是put过程中的resize方法在调用transfer方法的时候导致的环链。

我们举例说明一下：

```swift
public class HashMapInfiniteLoop {

    private static HashMap<Integer,String> map = new HashMap<Integer,String>(2，0.75f);  
    public static void main(String[] args) {  
        map.put(5， "C");

        new Thread("Thread1") {  
            public void run() {  
                map.put(7, "B");  
                System.out.println(map);  
            };  
        }.start();  
        new Thread("Thread2") {  
            public void run() {  
                map.put(3, "A);  
                System.out.println(map);  
            };  
        }.start();        
    }  
}

```

其中，map初始化为一个长度为2的数组，loadFactor=0.75，threshold=2\*0.75=1，也就是说当put第二个key的时候，map就需要进行resize。下面代码是jdk1.7的

```cs
void resize(int newCapacity) {   //传入新的容量
      Entry[] oldTable = table;    //引用扩容前的Entry数组
      int oldCapacity = oldTable.length;         
      if (oldCapacity == MAXIMUM_CAPACITY) {  //扩容前的数组大小如果已经达到最大(2^30)了
          threshold = Integer.MAX_VALUE; //修改阈值为int的最大值(2^31-1)，这样以后就不会扩容了
          return;
      }
   
      Entry[] newTable = new Entry[newCapacity];  //初始化一个新的Entry数组
     transfer(newTable);                         //！！将数据转移到新的Entry数组里
     table = newTable;                           //HashMap的table属性引用新的Entry数组
     threshold = (int)(newCapacity * loadFactor);//修改阈值
}

 void transfer(Entry[] newTable) {
      Entry[] src = table;                   //src引用了旧的Entry数组
      int newCapacity = newTable.length;
      for (int j = 0; j < src.length; j++) { //遍历旧的Entry数组
          Entry<K,V> e = src[j];             //取得旧Entry数组的每个元素
          if (e != null) {
              src[j] = null;//释放旧Entry数组的对象引用（for循环后，旧的Entry数组不再引用任何对象）
              do {
                  Entry<K,V> next = e.next;
                 int i = indexFor(e.hash, newCapacity); //！！重新计算每个元素在数组中的位置
                 e.next = newTable[i]; //标记[1]
                 newTable[i] = e;      //将元素放在数组上
                 e = next;             //访问下一个Entry链上的元素
             } while (e != null);
         }
     }
 
```

通过设置断点让线程1和线程2同时debug到transfer方法的首行。注意此时两个线程已经成功添加数据。放开thread1的断点至transfer方法的“Entry next = e.next;” 这一行；然后放开线程2的断点，让线程2进行完resize。结果如下图。

![Image](004-67b731dd.png "image.png")

注意，Thread1的 e 指向了key(3)，而next指向了key(7)，其在线程二 rehash 后，指向了线程二重组后的链表。

线程一被调度回来执行，先是执行 newTalbe[i] = e， 然后是e = next，导致了e指向了key(7)，而下一次循环的next = e.next导致了next指向了key(3)。

![Image](005-d87a39af.png "image.png")

![Image](006-0f945259.png "image.png")

e.next = newTable[i] 导致 key(3).next 指向了 key(7)。注意：此时的key(7).next 已经指向了key(3)， 环形链表就这样出现了。

![Image](007-35f5a717.png "image.png")

于是，当我们用线程一调用map.get(11)时，悲剧就出现了——Infinite Loop。

HashMap 有并发问题，并不单单指环链问题，而是在数据结构的设计上就没有考虑并发环境。HashMap 的设计目标是简洁高效，**没有采取任何措施保证 put、remove 操作的多线程安全**。put 方法的操作对象要么是整个散列表，要么是某个哈希桶里的链表或红黑树，而这些过程都没有采取措施保证多线程安全。在这个复杂的逻辑过程中，任何一个线程在这个过程中改动了散列表的结构，都有可能造成另一个线程的操作失败。

**java有一条深入人心的规则：“重写equals()时，必须重写hashCode()”,** 那么这是为什么呢？我们从hashMap的源码中也能看出些原因

```cs
 if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))
   e = p;

```

上面这段比较简单就不解释了，试想如果你的对象没有正确重写这两个方法，那么装在容器中一定会有问题。

参考 ：

-   https://coolshell.cn/articles/9606.html/comment-page-1#comments

-   https://tech.meituan.com/2016/06/24/java-hashmap.html

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-03-27-yi-ci-xing-gao-ding-hashmap-mian-shi/008-001cd8cd.jpg)

关注公众号 获取更多精彩内容
