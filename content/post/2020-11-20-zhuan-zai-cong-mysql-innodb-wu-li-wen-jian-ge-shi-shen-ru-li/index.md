---
title: "转载）从MySQL InnoDB 物理文件格式深入理解索引"
slug: 2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li
description: "（转载）从MySQL InnoDB 物理文件格式深入理解索引声明： 本文转载自 neoremind.comI"
date: 2020-11-20T03:24:16.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/cover.jpg
original_url: https://mp.weixin.qq.com/s/An_QlIsTUkXhg-jXbzkdlw
categories:
  - 数据库
tags:
  - MySQL
  - 数据结构
---
# （转载）从MySQL InnoDB 物理文件格式深入理解索引

声明： 本文转载自 neoremind.com

* * *

## InnoDB物理文件的基本结构

InnoDB的物理文件有很多种，包括：

1.  系统表空间（system tablespace）。文件以 ibdata1、ibdata2 等命名，包括元数据数据字典（表、列、索引等）、double write buffer、插入缓冲索引页（change buffer）、系统事务信息（sys\_trx）、默认包含 undo 回滚段（rollback segment）。
2.  用户表空间。innodb\_file\_per\_table=true 时，一个表对应一个独立的文件，文件以 db\_name/table\_name.ibd 命名。行存储在这类文件。另外还有 5.7 之后引入 General Tablespace，可以将多个表放到同一个文件里面。
3.  redo log。文件以 ib\_logfile0、ib\_logfile1 命名，滚动写入。主要满足ACID特性中的 Durablity 特性，保证数据的可靠性，同时把随机写变为内存写加文件顺序写，提高了MySQL的写吞吐。
4.  另外还可能存在临时表空间文件、undo 独立表空间等。

MySQL一次IO的最小单位是页（page），也可以理解为一次原子操作都是以 page 为单位的，默认大小16k。刚刚列出的所有物理文件结构上都是以 Page 构成的，只是 page 内部的结构不同。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/001-4ad7c518.jpg)

每个page包括最前面的 38 个字节的 FilHeader，和结尾的 8 个字节的 FilTrailer 组成。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/002-bb7e304c.jpg)

文章中类似风格的图片引用自JCole的博客

## 表空间的格式

除了 redo log 以外，刚刚提到的表空间，包括系统表空间、用户表空间、undo 独立表空间、临时表空间，他们的格式都是一样的，只是里面的 page 各有不同。本文主要介绍独立用户表空间的结构，进而深入解析索引。

表空间（tablespace）有一个 32 位的 spaceid，用户表空间物理上是由 page 连续构成的，每个 page 的序号是一个 32 位的 uint，page 0 位于文件物理偏移量 0 处，page 1 位于 16384 偏移量处。由此推出 InnoDB 单表最大 2^32 \* 16k = 64T。

表的所有行数据都存在页类型为 INDEX 的索引页（page）上，为了管理表空间，还需要很多其他的辅助页，例如文件管理页 FSP\_HDR/XDES、插入缓冲 IBUF\_BITMAP 页、INODE 页等。

2009年，INNOBASE 分享了关于 InnoDB 的物理结构，里面一张广为流传的图如下。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/003-67c01271.jpg)segment 和 extent 是 InnoDB 内部用于分配管理页的逻辑结构，用于分配与回收页，对于写入数据的性能至关重要。

但这张图有所局限性，可能会产生误解：

-   图中是系统表空间，因此存在 rollback segment，独立表空间则没有。
-   leaf node segment 实际是 InnoDB 的 inode 概念，一个 segment 可能包含最多32个碎片 page、0 个extent（用于小表优化），或者是非常多的 extent，我猜测作者图中画了 4 个 extent 是在描述表超过 32MB 大小的时候一次申请 4 个 extent。
-   一个 extent 在默认 16k 的 page 大小下，由 64 个 page 组成，page 大小由 UNIV\_PAGE\_SIZE 定义，所以 extent 不一定由 64 个 page 组成。

如果你觉得这几点不明白，那么坚持往下读。

## 文件管理页

文件管理页的页类型是 FSP\_HDR 和 XDES（extent descriptor），用于分配、管理 extent 和 page。

默认一个 extent（1MB大小）管理 64 个物理连续的 page（16k），extent 是 InnoDB 高效分配扩容 page 的机制。如果 page 更小（例如8k，4k），则仍然要保证 extent 最小 1M ，page 数就会相应变多；如果 page  变大（例如32k），则仍然是 64 个 page。

FSP\_HDR/XDES 页在表空间中的位置和内部结构如下。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/004-d3db9665.jpg)

FSP\_HDR 页都是 page 0，XDES 页一般出现在 page 16384, 32768 等固定的位置。一个 FSP\_HDR 或者 XDES 页大小同样是 16K，容量限制所能管理的 extent 必定是有限的，一般情况下，每个 extent 都有一个占 40字节的 XDES entry 描述维护，因此 1个 FSP\_HDR 页最多管理 256个 extent（也就是 256M，16384个 page）。那么随着表空间文件越来越大，就需要更多的 XDES 页。

XDES entry 存储所管理的 extent 状态：

1.  FREE（空）
2.  FREE\_FRAG（至少一个被占用）
3.  FULL\_FRAG（满）
4.  归某个 segment 管理的信息

XDES entry 还存储了每个 extent 内部 page 是否 free（有空间）信息（用 bitmap 表示）。XDES entry 组成了一个双向链表，同一种 extent 状态的首尾连在一起，便于管理。

FSP\_HDR 和 XDES 的唯一区别：FSP Header 只有在 page 0 FSP\_HDR 中有值。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/005-4e6f8a23.jpg)

而 FSP Header 里面最重要的信息就是四个链表头尾数据（ FLST\_BASE\_NODE 结构，FLST 意思是 first and last），FLST\_BASE\_NODE如下。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/006-cdd41afa.jpg)

1.  当一个 Extent 中所有 page 都未被使用时，挂在 FSP\_FREE list base node上，可以用于随后的分配；
2.  有一部分 page 被写入的 extent，挂在 FREE\_FRAG list base node 上；
3.  全满的 extent，挂在 FULL\_FRAG list base node 上；
4.  归属于某个 segment 时候挂在 FSEG list base node上。

当 InnoDB 写入数据的时候，会从这些链表上分配或者回收 extent 和 page，这些 extent 也都是在这几个链表上移动的。

## INODE 页

一般而言，INODE 一定会出现在文件的 page 2 上，如果管理的索引过多，才会分配更多的 INODE 页。夹在 page 2 INODE 页和 page 0 FSP\_HDR 中间，IBUF\_BITMAP 页暂不展开。

INODE页结构如下。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/007-9ec5b70b.jpg)

segment 是表空间管理的逻辑单位。INODE 页就是用于管理 segment 的，每个 Inode entry 负责一个segment。

下面会讲到，MySQL 的数据是按照 B+ tree 聚簇索引（clustered index）组织数据的，每个 B+ tree 使用两个 segment 来管理 page，分别是 leaf node segment（叶子节点segment）和 non-leaf node segment（非叶子节点segment）。这两个 segment 的 Inode entry 地址记录在 B+ tree 的  root page 中 FSEG\_HEADER 里面，而 root page 又被分配在 non-leaf segment 第一个碎片页上（fragment array）。

一个 segment 由:

-   32个碎片页（fragment array）
-   FSEG\_FREE
-   FSEG\_NOT\_FULL
-   FSEG\_FULL

组成，这些信息记录在 Inode entry 里，可以简单理解为 Inode 就是 segment 元信息的载体。

FREE、NOT\_FULL、FULL 三个 FLST\_BASE\_NODE 对象和 FSP\_HDR/XDES 页里面的 FSP\_FREE、FREE\_FRAG、FULL\_FRAG、FSEG 概念类似。这些链表被 InnoDB 使用，用于高效的管理页分配和回收。

至于碎片页上（fragment array），用于优化小表空间分配，先从全局的碎片分配 Page，当 fragment array 填满（32个槽位）时，之后每次分配一个完整的 Extent，如果表大于32MB，则一次分配 4个 extent。

因此可以回答 INNOBASE 图里面的 segment 概念了，只不过 segment 可能包含0或者多个（非常多的）extent。

## 把segment、extent、page概念串联起来

如下图所示。对照JCole博客的图可以更好的理解。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/008-7f189568.jpg)

## INDEX 数据索引页

### B+树聚簇索引

索引（index）用于快速定位数据，对于 InnoDB 来说，主键和非主键都是索引，一切数据都存储在 INDEX 索引页中，索引即数据，数据即索引。

试想下，加速查询的方法很多，可以是：

1.  哈希索引（hash），点查性能很好，需要解决冲突，区间查询也不友好。MySQL 只有自适应的哈希索引，数据组织的索引不会采用哈希索引。
2.  有序数组（sorted array），更新麻烦，只适用于静态存储引擎。
3.  二叉查找树（binary search tree），查询复杂度是 O(logN)，为了保持这棵树是平衡二叉树，更新的时间复杂度也是 O(logN)。

下图展示了各个存储介质的访问时延，从内存 100ns，到 NVME SSD 16us，到机械磁盘 3-10ms，二叉查找树最大的问题就在于随机IO，所以在机械盘时代，解决的思路就是减少随机 IO，自然而然想到的就是增加树的高度。因此 InnoDB 采用 N 叉平衡树组织索引和数据。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/009-c231ae32.jpg)

4.  N叉数 减少树的高度和随机IO次数，例如当 N=1200，树的高度可以控制在4层，管理 1200^3=17亿行。一般根节点在内存，所以最多3次磁盘 IO。不仅减少了随机 IO 次数还保证了查询的稳定性，所以说这种数据结构是一种 scales nicely 的解决方案。

5.  新模型 一些新的存储数据结构采用LSM-tree、跳表skiplist等不在本文讨论范围内。

既然多叉树可以满足查询性能，下面再来看索引和数据是否有必要放在一起呢？索引的组织形式可以是聚簇（clustered）和非聚簇（unclustered）的。

clustered index 将数据按照索引的顺序存储。通常来讲，索引和数据在一起，找到了索引也就找到了数据（但不一定强求）。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/010-222b794c.jpg)unclustered index 则将数据与索引分开结构，索引指向了具体的记录。索引相近的记录，在物理文件上相距可能很远。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/011-bf251a38.jpg)

一张 MySQL 表只有一个聚簇索引，聚簇索引可以看做主键，如果建表没有指定主键默认采用第一个 NOT NULL UNIQUE INDEX 当主键，否则默认 6字节的 ROW ID 做主键。总之 InnoDB 必须有一个 primary key。聚簇索引通常就是 B+树（B+ tree）结构，如下图所示。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/012-a31c62f1.jpg)

使用B+树聚簇索引（B+ tree clustered index）的好处在于:

1.  数据和索引顺序一致，充分利用磁盘顺序 IO 性能普遍高于随机 IO 的特性。
2.  对于局部性查询也会大有裨益。
3.  采用 B+树，叶子节点（leaf node）存储数据，非叶子节点（non-leaf node）只是索引，这样非叶子节点就会足够的小，因此数据很“热”，便于更好的缓存。
4.  对于覆盖索引，可以直接利用叶子节点的主键值。

二级索引，就可以理解为非聚簇索引，也是一颗 B+树，只不过这棵树的叶子节点是指向聚簇索引主键的，可以看做“行指针”，因此查询的时候需要 “回表”。

另外一些数据库采用堆表（heap）的方式组织数据和索引。

假设存在一张表，没有任何索引，B+树 有三层，按照自增主键插入，可以用 alibaba/innodb-java-reader 工具生成 innodb file LSN heatmap，即 page的热力图，按照 page 被更新的 LSN（Logical Sequence Number）由小到大，由蓝变红，如下图所示。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/013-d7753cb8.jpg)

可以看出 level2 的 root page 总是红色的，因为插入会频繁访问 root page，叶子节点由蓝变红，符合自增主键顺序写入的特性，这也间接证明了自增主键的优势，充分利用利用顺序IO，避免 B+树 频繁分裂合并。灰色圈出来的两个 page 是 level=1 的非叶子节点，有两个，右侧节点从左侧分裂而来，因此持续一直“热”到写入结束。

把这个物理文件的变为逻辑的B+树结构，如下图所示。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/014-afc68344.jpg)

### 索引页结构

索引页包含的信息如下：

1.  主键、二级索引、行和列

-   B+树的每个节点都是一个INDEX索引页，其结构都是相同的。
-   对于聚簇索引，非叶子节点包含主键和 child page number，叶子节点包含主键和具体的行；
-   对于非聚簇索引，也就是二级索引，非叶子节点包含二级索引和 child page number，叶子节点包含二级索引和主键值。

行是由列组成的，各种列类型（column types）经过 encoding 编码后才组成了一行。

2.  高效检索的数据结构

B+树结构可以用于快速做 point-query 和 range-query，索引页中必定包含高效检索的数据结构，实际使用的就是 sorted array 和 singly-linked-list，页内支持二分查找。同一层的页之间是 double-linked-list 双向链接的。

3.  支持OLTP数据库特性相关信息

InnoDB 在读写方面，支持事务、行锁、MVCC 非锁定一致性读，ACID 特性，crash recovery 特性等，在索引页里同样包含一些属性支持这些特性。

索引页物理结构如下图所示。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/015-b9c45f9e.jpg)

Index header包含了页的一些元数据。

-   Num of directory slots：page directory slots 个数，用于二分查找检索初始化 sorted array size使用。
-   Heap top position：页把插入的数据看做数组，用于记录已使用空间的末尾，从这个位置到 page directory都是 free space。
-   Num of heap records & page format：低15位表示 Num of heap records，最高的一位表示类型，也就是 record format，包括 COMPACT、REDUNDANT 等，下文会提到。
-   First garbage record offset、Garbage space：表示删除数据 singly-linked-list 的起始 record和空间占用。
-   Last insertion position：最后插入数据的位置，用户快速顺序写入。
-   Page direction：插入方向，插入的数据与 Last insertion position 比的相对方位，包括 LEFT、RIGHT、NO\_DIRECTION 等。
-   Num of inserts in page direction：同一方向连续插入的记录数。
-   Num of records：未删除的记录数，剔除掉 infimum 和supremum 记录。
-   Max trx. id：最大事务id，用于支持 MVCC。
-   Page level：B+树层数，叶子节点为0，非叶子节点递增。
-   Index id：索引id。

FSEG header 包含了指向叶子节点和非叶子节点的 Inode entry 的数据：Inode spaceid、Inode page no.、Inode offset。

infimum 和 supremum 是 system records，用于起始记录和结束记录，对用户不可见，把真正的 record 按照升序串起来成为单链表。这两个 record 和普通的 record 结构一样，都包含 record header 和 body，只不过它们的 body 分别是 “infimum\\0” 和 “supremum” 字符串，不像真正的 record 由主键、所有列的值等组成。

例如图中的物理视图，表示按自增主键顺序插入的16条记录，它们的长度可能不一样，比如包含了 varchar 类型的列。把他们转化为逻辑视图，他们是一个有序单链表（sorted singly linked list），头尾就是 infimum 和 supremum 记录，串起来的指针在 record header 里面，record header 有2字节的 next record offset 指向下一条记录的相对物理偏移量。

通过这个有序单链表 InnoDB 就有能力在某个页中做检索查询，给定一个 key，从 infimum 顺序查找，直到到 supremum 结束，时间复杂度 O(N)。

那么有没有什么加速的办法呢？答案是利用 page directory。

page directory 从 Fil Trailer 开始从后往前写，里面包含槽位 slots，每个 slot 2个字节，存储了某些 record 在该页中的物理偏移量，例如图中最后面是 infimum record 的 offset，最前面是 supremum record 的 offset，中间从后往前是 r4，r8，r12 record 的 offset，一般总是每隔4-8个 record 添加一个 slot，这样 slots 就等同于一个稀疏索引（sparse index），加速页内查询的办法就是通过二分查找，查询 key 的时间复杂度可以降为 O(logN)，由于页都在内存里面，所以查询性能可控，内存访问延迟100ns左右，如果在 CPU 缓存中则可能更快。

在 heap top position 和 page directory 中间的都是 free space，用于 record 和 slot 从两端填充进去，对于删除的记录只是标记删除，实际空间回收再利用会延后进行。

### 索引页案例

把宏观的B+树和微观的页结构以一个案例说明下。

假设有如下的几条数据，

`id,VALUE   100,a   199,b   200,c   299,d   300,e   400,f   500,g   550,h   600,i   650,j   ...   `

一颗 B+树 聚簇索引如下图所示，3层的 B+树，非叶子节点的 record 由主键和 child page number 组成，主键是 child page number 中最小的主键值；叶子节点的 record 由主键和行组成。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/016-eed19e1d.jpg)

微观上把每个页节点内部展开成由 infimum 和 supermum 连接起来的有序单链表，结构如下。每层的页通过 Fil Header相互连接。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/017-fc9f5916.jpg)

这个案例图实际上想呼应丁奇老师《MySQL实战45讲》里的第五讲索引里面的图。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/018-1c59e30b.jpg)

这张图是一张局部图，非叶子节点每个记录后面的小窄条，都可以看做是 node pointer，指向 child page number。绝大部分资料实际都应该画了 B+树 上的一部分，图中 300 后面的指针实际是 300 这个记录的 node pointer，其叶子节点的元素都不小于 300 这个值。而前面实际还应该画出一个小于等于 100 的值，它的 node pointer 才指向 100 的那个叶子节点。

### Row Format

下面介绍具体每一行的结构。

InnoDB有如下4种row format，下图来自MySQL官方文档。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/019-185aa73e.jpg)

row format 可通过 innodb\_default\_row\_format 参数指定，也可以在建表的时候指定。

`CREATE TABLE tab (      id INT,      str VARCHAR(50)   ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;   `

REDUNDANT 是比较老的格式，流行的版本中 5.6 默认是 COMPACT，COMPACT 比 REDUNDANT 要更节省空间，大概在 20% 左右。5.7 版本 DYNAMIC 是默认格式，DYNAMIC 在变长存储上做了更大的空间优化，对于 VARBINARY, VARCHAR, BLOB 和 TEXT 类型更友好，下面会更详细展开。COMPRESSED 是压缩页。

下面的介绍都是基于 COMPACT 及其之后格式的。

row 的格式在上面图中简单介绍过，由 可选的两个标识+record header+body 组成，具体如下。![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/020-a0338877.jpg)

1.  Nullable field bitmap：可选标识，表明哪些列是 NULL，如果没有 nullable 字段，就不存在。很多文章都没说清楚这部分，画个图就明白了，一个字节能表示8个nullable字段，超过8个字段就扩充到低字节。如下图所示，18个字段，9个可为空，如果其中某3个实际为空，则两个字节存储如图。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/021-e93b2fbd.jpg)

2.  Variable field lengths：可选标识，变长字段长度，如果没有变长字段，就不存在。每个变长字段都用 1-2个字节表示长度，根据列定义顺序逆序存放，其算法很多书里都提过，但是都有些省略，具体解析过程可以参考 rem0rec.cc。如果小于等于127，则1个字节；大于127，低字节下一位的表示是否有 overflow pag e存储，剩余6位和高字节的8位，按照大尾端 encoding 组成变长长度。

3.  record header：固定5个字节长度。

    Info Flags：1个字节。低4位表示是否 min\_rec 或者 deleted。高4位表示 num of records owned，与上面提到的 page directory 呼应，如果被 page directory slot 指向，则有值。

    2个大尾端字节：低三位表示类型，包括

-   普通记录 REC\_STATUS\_ORDINARY=0

-   非叶子节点记录 REC\_STATUS\_NODE\_PTR=1

-   起始虚拟记录 REC\_STATUS\_INFIMUM=2

-   终点虚拟记录 REC\_STATUS\_SUPREMUM=3

    高5位表示heap no，即顺序位置。

    2字节 next record offset：直接定位到下一个record的数据部分，也就是主键偏移量，而不是record header。

    可以看出如果表结构没有变长字段，没有 nullable 字段，则不会存在冗余信息。5个字节长度的 record header 是必须有的，上面提到的 infimum 和 supremum 也是一种特殊的 row，只不多对用户不可见。

4.  索引：序列化后存储于此，例如 int 类型索引主键就占用4个字节。

-   对于聚簇索引的叶子节点，存储行。

-   对于二级索引的叶子节点，存储行的主键值。

-   对于聚簇索引和二级索引的非叶子节点，存储 child page 最小的 key。

    上面提到的 infimum 和 supremum 中就只存字符串在行数据里。

5.  6字节事务ID 和 7字节回滚指针：

    这两个值用来支持 MVCC 机制，事务ID是实现事务隔离级别的基础，而通过回滚指针指向 undo log，可实现非锁定一致性读。

6.  非主键列的数据：

-   对于聚簇索引的叶子节点，是按照表结构定义排列的 columns，每种 column 类型都有自己的 encoding 方法。

-   对于二级索引的叶子节点，是行的主键值。

-   对于聚簇索引和二级索引的非叶子节点，是 child page number。

    每一列的解析在 DataTypeHandler.cc 源码里可以找到，有 encoding 和 decoding 的方法。比如 int 比较简单4个字节，对于 varchar、text 需要按照列或者表的 charset encoding 出来，对于 varbinary、blob 就是裸的二进制数据，对于 datatime 等时间相关的有相应的机制去做序列化。

    对于变长字段，MySQL 有一套规则可以存储在 overflow page 中，这个 page 是 BLOB 类型，也就是不在行所在的 page 中存储，这样可以优化空间，在索引页中存储最有价值的行信息，而不是在 B+ tree 中节点充斥着很大的列，进一步提高索引的存储效率；另外还支持了存储大于一页 16k 大小的数据。

    一般情况下，对于变长字段，如果大于768字节，则启用 off-page 策略，索引页存储前768字节，然后外加20字节 pointer 信息包含 space id，overflow page number，offset 和存放在 overflow page 的字节数。对于 DYNAMIC 则做的更加极致，即可以做 fully off-page，只存20字节的 pointer 信息，也可以对于小数据 <=40 bytes 做 inline，不 off-page。overflow page 是一个单链表，每个 BLOB page 都存储了一部分数据。在 MySQL 8.0 之后对于这个结构又做了进一步优化，可以随机访问大列的一部分，为此引入了 LOB 类型，感兴趣可以参考链接。

## 总结

深入理解 MySQL InnoDB 表空间物理文件格式，对于更好的认识索引，有很大帮助。本文从独立表空间入手，展开介绍了 extent、segment、inode 等页管理和分配的概念，用实际的案例阐述了 InnoDB B+树中每个节点的索引页结构，如何做点查和范围查询，索引页的内部结构，以及每个行的组成，查阅了不少资料以及 MySQL 源代码，alibaba/innodb-java-reader 这个开源项目，可以帮助读者更好的理解。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-11-20-zhuan-zai-cong-mysql-innodb-wu-li-wen-jian-ge-shi-shen-ru-li/022-401a2213.gif)

关注公众号 获取更多精彩内容
