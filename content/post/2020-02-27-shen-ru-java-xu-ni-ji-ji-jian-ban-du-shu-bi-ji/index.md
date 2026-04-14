---
title: "深入java虚拟机（极简版读书笔记）"
slug: 2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji
description: "深入java虚拟机这本书已经出了三版了，第三版是19年出的，笔者读过第二版和第三版，我的感受是，当一本技术书"
date: 2020-02-27T12:12:45.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/cover.jpg
original_url: https://mp.weixin.qq.com/s/9-aFO_CxhFH0O0D3FXrV9Q
categories:
  - 后端
tags:
  - Java
  - JVM
  - 算法
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/001-f35804e2.jpg)

深入java虚拟机这本书已经出了三版了，第三版是19年出的，笔者读过第二版和第三版，我的感受是，当一本技术书在没有完全吃透的情况下，每读一遍都会有新的收获，**以下读书笔记整理是基于第二版的**，第三版出版后填了许多第二版留下的 “坑”，增加了不少“与时俱进”的内容，感兴趣的小伙伴可以去找一下读读看，也许能解答你多年的疑惑。第三版我是在微信读书用免费试用的无限卡看完的，三版纸质书原价过百了  ![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/002-8a0b2bc1.png)

**声明：****以下整理的笔记内容是极简版(****带部分私货****)，即我认为的部分重要内容梗概，方便做知识图谱的勾勒，不能详尽的表达所有涉及知识，想要深入学习最好还是去看书。
**

****一  内存区域及对象创建****

1.1 运行时数据区 

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/003-512fff27.jpg)

         jdk7默认栈大小为1M java -XX:+PrintFlagsFinal -version | grep -i 'stack' 可查看与stack相关信息

1.2 分配对象空间

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/004-ae8cf34c.png)

  **慢速分配 重点在是否用TLAB和“指针碰撞”**

1.3 TLAB

     JVM在内存新生代Eden Space中开辟了一小块线程私有的区域，称作TLAB（Thread-local allocation buffer）。默认设定为占用Eden Space的1%。在Java程序中很多对象都是小对象且用过即丢，它们不存在线程共享也适合被快速GC，所以对于小对象通常JVM会优先分配在TLAB上，并且TLAB上的分配由于是线程私有所以没有锁开销。因此在实践中分配多个小对象的效率通常比分配一个大对象的效率要高。也就是说，Java中每个线程都会有自己的缓冲区称作TLAB（Thread-local allocation buffer），每个TLAB都只有一个线程可以操作，TLAB结合bump-the-pointer技术可以实现快速的对象分配，而不需要任何的锁进行同步，也就是说，在对象分配的时候不用锁住整个堆，而只需要在自己的缓冲区分配即可。

1.4 Mark Word

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/005-d69b9355.jpg)

**二 垃圾回收**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/006-c869c3d2.jpg)

2.1 如何确定对象已死？

 **引用计数算法**

          不用！问题是有对象循环引用的问题

 **可达性分析算法**

         用**GC Roots** 作为起点，当一个对象到GC Roots没有任何引用链相连，就可回收，枚举GCRoots会导致 “ stop the world  ” 以下对象被标记成Root:

-    Class: 由系统类加载器(system class loader)加载的类，它们不能被卸载。由自定义的类加载器加载的类不是Root，除非相应的java.lang.Class的实例是其它类型的Root

-   Thread: 活着的线程

-    Stack Local:Java方法的参数或者本地变量

-   JNI Local: JNI方法的参数或者本地变量

-   Monitor Used：同步用的监控器

-   Held by JVM: JVM自己持有的对象，比如系统类加载器，一些异常等

2.2 对象引用

    • 强引用：new 出来的一般对象，只要引用在就不会被回收 

    • 软引用: 将要发生内存溢出之前回收 

    • 弱引用: 生存到下一次垃圾收集发生之前

    • 虚引用：目的是对象被收集器回收时收到一个系统通知

2.3 垃圾收集算法

    **复制-Cpoying:**

-   将内存分成两块，一块用完了，将可用的放到另一块，第一块全部回收，缺点，只能用一半的内存代价太高。

-   在新生代中，每次垃圾收集时都发现有大批对象死去，只有少量存活，选用：复制算法在老年代中因为对象存活率高、没有额外空间对它进行分配担保，就必须使用“标记-清除”或者“标记-整理”算法来进行回收。

    **标记清除-Mark-Sweep:**

             先标记后清除 缺点：1 效率不高 2 内存碎片导致提前触发回收

    **标记整理-Mark-Compact:**

             将存活的对象向一端移动，直接清理掉边界以外的内存

     **分代收集算法-Generational Collection**

2.4 算法实现

    hotspot的算法实现 ,如何发起回收 

    • 枚举根节点 

    • 安全点 safepoint 

    • 安全区域safeRegion

2.5 垃圾收集器

    有关这一节的内容我在前文 [JVM G1(Garbage First)垃圾收集器浅析](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247484047&idx=1&sn=655c07e671807625996c0bbabbe532cb&chksm=eb6dbd09dc1a341fc7ffe064293c8dc5042bf0d0c7232c74740dc42e971c946cbf6102c9a71b&scene=21#wechat_redirect) 中都有写到，这里就不赘述了。

2.6 内存分配

     Minor GC

-   存活对象会反复在S0和S1之间移动，当对象从Eden移动到Survivor或者在Survivor之间移动时，对象的GC年龄自动累加，当GC年龄超过默认阈值15时，会将该对象移动到老年代，可以通过参数-XX:MaxTenuringThreshold 对GC年龄的阈值进行设置。

-   长久存活的直接进入老年代，默认年龄15岁

-    大对象直接进入老年代，所谓大对象就是大量连续内存空间的对象。-XX:PretenureSizeThreshold参数，令大于这个值的对象直接进入老年代

-   Minor GC触发条件：当Eden区满时，触发Minor GC。

     空间分配担保

-    当 JVM 无法为一个新的对象分配空间时会触发 Minor GC，比如当 Eden 区满了就会进行MinorGC,在MinorGC之前 检查老年代最大连续可用空间是否大于新生代所有对象空间总和。

2.7  Full GC

        什么时候发产生？

-    System.gc()方法的调用

-   老年代代空间不足

-   永生区空间不足

-   CMS GC时出现promotion failed和concurrent mode failure

-   统计得到的Minor GC晋升到旧生代的平均大小大于老年代的剩余空间

-   堆中分配很大的对象

2.8  回收方法区

        主要是两部分 • 废弃常量 • 无用的类

2.9  Sto The World 

         stop the world (STW) 不管是新生代老生代都会产生STW,重点是时长多久

**三 性能监控与故障处理工具**

-   jps(JVM Process Status):虚拟机进程状况工具 显示虚拟机进程 jps -l

-   jstat(JVM Statistics Monitoring Tool):监控虚拟机各种运行状态

-   jinfo(Configuration Info for Java):java配置信息工具

-   jmap(Memory Map for Java) 堆转储快照

-   jstack(Stack Trace for Java) java堆栈跟踪工具

-   监控工具：

    • jconsole

    • visualVM

    • BTrace 动态日志跟踪：可以通过HotSpot虚拟机的HotSwap的技术动态加入 原来不存在的调试代码。

**四 class 文件
**

     一文让你明白java字节码（https://www.jianshu.com/p/252f381a6bc4）,这篇文章写的很明白！

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/007-f0a591f0.jpg)

**五 虚拟机类加载机制**

     虚拟机把描述类的数据从Class文件加载 到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的JAVA类型，这就是虚拟机的类加载机制。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/008-e0cceb1c.png)

加载 :  一个类必须与类加载器一起确定唯一性 • 加载阶段完成后，虚拟机外部的二进制字节流就按照虚拟机所需的格式存储在方法区之中。

验证：可以使用 -Xverify:none参数来关闭大部分的类验证措施，以缩短虚拟机类加载的时间。

准备：准备阶段是正式为类变量分配内存并设置类变量初始值的阶段，这些变量所使用的内存都将在方法区中进行分配。

5.1 类加载器

       虚拟机设计团队把类加载阶段中的“通过一个类的全限定名来获取描述此类的二进制字节流”这个动作放到JAVA虚拟机外部去实现，以便让应用程序自己决定如何去获取所需要的类。实现这个动作的代码模块称为“类加载器”

      比较两个类是否“相等”，只有在这两个类是由同一个类加载器加载的前提下才有意义

5.2 双亲委派模型

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/009-3a35ffcd.jpg)

-   启动类加载器（Bootstrap ClassLoader）,加载<JAVA\_HOME>\\lib 目录中的类库 

-   扩展类加载器(Extension ClassLoader),加载<JAVA\_HOME>\\lib\\ext目录中的类库 

-   应用程序类加载器(Application ClassLoader)，加载用户类路径（ClassPath）上所指定的类库

        如果一个类加载器收到类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器完成。每个类加载器都是如此，只有当父加载器在自己的搜索范围内找不到指定的类时（即ClassNotFoundException），子加载器才会尝试自己去加载

5.3 破坏双亲委派模型

-   JNDI、JDBC等

-   OSGI

5.4 SPI 

       SPI 全称为 (Service Provider Interface) ,是JDK内置的一种服务提供发现机制。目前有不少框架用它来做服务的扩展发现， 简单来说，它就是一种动态替换发现的机制， 举个例子来说， 有个接口，想运行时动态的给它添加实现，你只需要添加一个实现。具体是在JAR包的"src/META-INF/services/"目录下建立一个文件，文件名是接口的全限定名，文件的内容可以有多行，每行都是该接口对应的具体实现类的全限定名

        java的spi 的简单应用(https://www.cnblogs.com/huzi007/p/6679215.html)

**六  虚拟机字节码执行引擎**

     栈帧的概念结构

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/010-cbd3a39f.jpg)

   局部变量表

       第0位索引存储的是所属对象实例的引用 ，即this

**七  晚期（运行期）优化**

-   hotspot内置两个编译器C1和C2，解释器和编译器搭配使用的方式在虚拟机中称为“混合模式”（Mixed Mode） c1编译器获取更快的编译速度，c2获取更高的编译质量。

-   在虚拟机执行架构中，解释器与编译器经常配合工作。

-   参数 -Xint 强制虚拟机为解释模式（Interpreted mode），这时编译器完全不介入

-   参数 -Xcomp强制为解释模式(Compiled Mode)

-   分层编译策略 JDK7默认开启

-   栈上替换(On Stack Replacement --OSR),即方法栈帧还在栈上，方法就被替换了

-   判断一段代码是不是热点代码称为热点探测

      • 基于采样的热点探测

      • 基于计数器的热点探测--目前用的是这种

7.1 JIT编译器、解释、编译

        在 JVM 中，编译是基于两个计数器的：一个是方法被调用的次数，另一个是方法中循环被回弹执行的次数。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/011-417fc21d.jpg)

**八 内存模型**

8.1 volatile

-    volatile可以禁止指令重排序优化

-    保证可见性、不保证原子性

-   不保证原子性,并不保证互斥(也就是说多个线程并发修改某个变量时，依旧会产生多线程问题，但适合使用一个线程写，多个线程读的场合)

-   禁止指令重排的原理是插入许多内存屏障指令

    以下场景可以使用volatile

-   运算结果并不依赖变量的当前值，或者能够确保只有单一的线程修改变量的值

-   变量不需要与其他的状态变量共同参与不变约束

8.2 volatile 原理

        使用Violatile修饰的变量在汇编阶段，会多出一条lock前缀指令，它在多核处理器下会引发两件事情：将当前处理器缓存行的数据写回到系统内存 这个写回内存的操作会使在其他CPU里缓存了该内存地址的数据无效。通常处理器和内存之间都有几级缓存来提高处理速度，处理器先将内存中的数据读取到内部缓存后再进行操作，但是对于缓存写会内存的时机则无法得知，因此在一个处理器里修改的变量值，不一定能及时写会缓存，这种变量修改对其他处理器变得“不可见”了。但是，使用Volatile修饰的变量，在写操作的时候，会强制将这个变量所在缓存行的数据写回到内存中，但即使写回到内存，其他处理器也有可能使用内部的缓存数据，从而导致变量不一致，所以，在多处理器下，为了保证各个处理器的缓存是一致的，就会实现缓存一致性协议，每个处理器通过嗅探在总线上传播的数据来检查自己缓存的值是不是过期，如果过期，就会将该缓存行设置成无效状态，下次要使用就会重新从内存中读取。

        volatile语义中的**内存屏障**策略非常严格保守，非常悲观且毫无安全感的心态：在每个volatile写操作前插入StoreStore屏障，在写操作后插入StoreLoad屏障；在每个volatile读操作前插入LoadLoad屏障，在读操作后插入LoadStore屏障；由于内存屏障的作用，避免了volatile变量和其它指令重排序、线程之间实现了通信，使得volatile表现出了锁的特性。

8.3     原子性、可见性、 有序性

-   基本数据类型的读写是具有原子性的 在synchronized块之间的操作也具备原子性

-   volatile变量保证了多线程操作时变量的可见性，而普通变量则不能保证这一点。

-   synchronized和final也可以实现可见性

-   volatile和synchronized保证线程间操作的有序性

8.4  先行发生原则 happens-before

-   程序次序规则。在一个线程内，书写在前面的代码先行发生于后面的。确切地说应该是，按照程序的控制流顺序，因为存在一些分支结构。 

-    Volatile变量规则。对一个volatile修饰的变量，对他的写操作先行发生于读操作。 

-   线程启动规则。Thread对象的start()方法先行发生于此线程的每一个动作。

-   线程终止规则。线程的所有操作都先行发生于对此线程的终止检测。 

-    线程中断规则。对线程interrupt()方法的调用先行发生于被中断线程的代码所检测到的中断事件。 

-   对象终止规则。一个对象的初始化完成（构造函数之行结束）先行发生于发的finilize()方法的开始。

-   传递性。A先行发生B，B先行发生C，那么，A先行发生C。

-   管程锁定规则。一个unlock操作先行发生于后面对同一个锁的lock操作。

   时间先后顺序与先行发生原则之间基本没有太大的关系。

**九 锁**

9.1 锁优化

9.1.1 自旋锁

       自旋锁原理非常简单，如果持有锁的线程能在很短时间内释放锁资源，那么那些等待竞争锁的线程就不需要做内核态和用户态之间的切换进入阻塞挂起状态，它们只需要等一等（自旋），等持有锁的线程释放锁后即可立即获取锁，这样就避免用户线程和内核的切换的消耗。但是线程自旋是需要消耗cup的，说白了就是让cup在做无用功，线程不能一直占用cup自旋做无用功，所以需要设定一个自旋等待的最大时间。如果持有锁的线程执行的时间超过自旋等待的最大时间扔没有释放锁，就会导致其它争用锁的线程在最大等待时间内还是获取不到锁，这时争用线程会停止自旋进入阻塞状态。

9.1.2 轻量级锁

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/012-c6dffd83.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/013-0bfa53f2.jpg)

9.1.3 偏向锁

        偏向锁也是JDK 6中引入的一项锁优化措施，它的目的是消除数据在无竞争情况下的同步原语，进一步提高程序的运行性能。如果说轻量级锁是在无竞争的情况下使用CAS操作去消除同步使用的互斥量，那偏向锁就是在无竞争的情况下把整个同步都消除掉，连CAS操作都不去做了。偏向锁中的“偏”，就是偏心的“偏”、偏袒的“偏”。它的意思是这个锁会偏向于第一个获得它的线程，如果在接下来的执行过程中，该锁一直没有被其他的线程获取，则持有偏向锁的线程将永远不需要再进行同步。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/014-6c722f78.jpg)

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/015-13517ca7.jpg)

9.2 CAS

      CAS（Compare and Swap）是一种乐观锁（每次不加锁，假设没有冲突去完成某项操作，如果因为冲突失败就重试，直到成功为止。）

-   CAS存在ABA问题， java用 AtomicStampedReference，带有标记的原子引用类解决了这个问题。

-   AtomicInteger就是用CAS实现的

AtomicLongFieldUpdater可以对指定"类的 'volatile long'类型的成员"进行原子更新。它是基于反射原理实现的。

-   只能保证一个共享变量的原子操作。对一个共享变量执行操作时，CAS能够保证原子操作，但是对多个共享变量操作时，CAS是无法保证操作的原子性的。Java从1.5开始JDK提供了AtomicReference类来保证引用对象之间的原子性，可以把多个变量放在一个对象里来进行CAS操作。

-   CAS通过调用JNI的代码实现的。JNI:Java Native Interface为JAVA本地调用，允许java调用其他语言。而compareAndSwapInt就是借助C来调用CPU底层指令(Atomic::cmpxchg(x,addr,e))实现的。

￼

**☆ END ☆**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-27-shen-ru-java-xu-ni-ji-ji-jian-ban-du-shu-bi-ji/016-2f173b87.jpg)

**关注公众号 获取更多精彩内容**
