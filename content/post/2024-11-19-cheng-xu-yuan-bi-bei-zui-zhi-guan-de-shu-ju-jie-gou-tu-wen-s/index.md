---
title: "程序员必备：最直观的数据结构图文手册"
slug: 2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s
description: "这篇文章为了方便以可视化的方式回顾那些最常用的数据结构，你可以用它做面试准备时的复习。希望这些可视化例子能够帮助大家了解这些数据结构。"
date: 2024-11-19T03:47:23.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/cover.jpg
original_url: https://mp.weixin.qq.com/s/3p8iTTBmq5JXcwgfWOYVKw
categories:
  - 行业与思考
tags:
  - 算法
  - 数据结构
  - 面试
---
这篇文章为了方便以可视化的方式回顾那些最常用的数据结构，你可以用它做面试准备时的复习。希望这些可视化例子能够帮助大家了解这些数据结构。

## 大 O --时间复杂度

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/001-16aa0e79.png)

**为什么大 O 复杂度很重要 ？**：对于小数据集，算法复杂度可能不会扮演非常重要的角色，但随着我们的数据量增大——算法的性能影响对响应时间有极大的影响。因此，关注复杂度在具有合理规模的任何应用领域中对于程序质量都起着至关重要的作用。

举个例子：

假设我们的数据集有 100 万（1,000,000）个元素

-   `O(1)`算法将进行 1 次操作。
-   `O(log(n))`算法将进行 20 次操作
-   `O(n)`算法将进行 1000000 次操作。
-   `O(n * log(n))`算法将进行 2000 万次操作。
-   `O(n 2 )`算法将进行 1 万亿次（1,000,000,000,000）操作。

所以，你应该能看出算法复杂度的重要性。

## RUM 权衡

另一个在选择数据结构时需要注意的重要方面是 RUM 权衡

-   读取效率（R）：从数据结构中检索或访问数据有多快。
-   更新效率（U）：在数据结构中插入、删除或修改数据有多快。
-   内存效率（M）：数据结构使用的内存或空间大小。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/002-3c8c7427.png)

## 那些最常用且重要的数据结构

### 数组 & 链表

数组在内存中连续存储，以快速查找而闻名，但更新/写入时间较慢；而链表非连续存储，以快速更新/写入而闻名，但查找较慢

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/003-95dddf47.png)

### 队列

线性数据结构，遵循先进先出（FIFO）原则：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/004-8f0f7eb3.png)

### 堆栈

遵循后进先出（LIFO）原则，元素从顶部添加和移除：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/005-026b9a2b.png)

### 哈希表

提供几乎即时的元素访问，通过使用哈希函数创建键值对来实现。插入、删除和查找的时间复杂度为 O(1)，代价是内存利用率

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/006-e236353a.png)

## 树形数据结构

树形数据结构常用于数据密集型应用。

在列出所有数据结构之前，我们首先需要回顾一个在树结构中起着关键作用的算法——二分查找算法。

### 二分查找

这是一个对排序元素的搜索，通过不断将搜索空间分成一半来完成。就像在字典中找到中间页面，检查我们的搜索词是在字典的左半部分还是右半部分，然后不断重复这个过程，直到找到元素。使用高效的 O(log(n)) 查找

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/007-7943b840.png)

### 二叉搜索树

一棵二叉树，其中每个节点最多有两个子节点，且左子节点的值小于父节点，右子节点的值大于父节点。如果二叉搜索树平衡（位于左边的节点数量不超过右边的节点数量很多），则可以进行高效的 O(log(n)) 查找。这是因为我们在遍历树时（从父节点到子节点）将搜索空间减半

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/008-c33cbbdc.png)

### 红黑树

二叉搜索树通过将节点分配颜色（红色或黑色）并遵循一组确保其保持平衡的规则来维护其平衡：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/009-b78ecec1.png)

### AVL 树

> “
> 
> AVL 树的全称是 Adelson-Velsky and Landis Tree，以其发明者 G. M. Adelson-Velsky 和 E. M. Landis 的名字命名。

自平衡二叉搜索树，通过确保其平衡因子（所有左子树和右子树之间的高度差）至多为 1 来实现平衡。在插入和删除操作期间通过旋转自动重新平衡

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/010-2c19daa3.png)

### 堆

树中每个父节点要么大于等于（最大堆）其子节点，要么小于等于（最小堆）其子节点。允许高效检索最小或最大值，常用于实现优先队列。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/011-95c0e4d2.png)

### 跳表

跳表（Skip List）是链表的一种扩展结构，通过引入多级链表来加速查找、插入和删除操作。它的工作原理是允许通过“跳跃”多个链表元素来快速定位到目标节点，这通常是通过从父级链表向下遍历到合适的子级链表来实现的。这种结构类似于二叉搜索树，但具有一定的随机性，通常在效率和简单性上都有不错的表现。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/012-7eaa63ee.png)

### B+ 树

常用于数据库存储。B+树是一种平衡树，其中所有数据都存储在叶节点中，这些叶节点按顺序链接在一起，以便快速顺序访问：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/013-68f325e6.png)

### LSM（Log-Structured Merge）树

数据应用中常用的写优化树，为了理解 LSM 树，我们需要熟悉另外两种数据结构：Memtables（内存表）和 SSTables（排序字符串表）。

**Memtable**

最初，数据被写入一个称为 Memtable 的内存结构中。这个 Memtable 在内存中保存数据，直到达到一定大小，通常通过使用平衡搜索树（如红黑树）、跳表或哈希表来实现，以提供高效的读取访问。当 Memtable 满时，其内容会被写入磁盘作为新的 SSTable。这个过程称为刷新。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/014-9ba50bba.png)

**SSTable**

SSTables 根据键的顺序存储数据。每个 SSTable 由一系列键值对组成，其中键是有序的。一旦创建 SSTable，它就不会被修改。相反，新的数据更新会写入新的 SSTable。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/015-244ce596.png)

SSTables 通常使用 Bloom 过滤器、稀疏索引等辅助数据结构来快速确定键是否存在于 SSTable 中或定位值。

随着时间的推移，由于频繁更新，可能会创建多个 SSTables。为了优化性能和回收空间，SSTables 会定期合并和压缩。这涉及到将多个 SSTables 中的数据合并成更少的新的 SSTables，同时丢弃过时的条目。

下图是 LSM treee 的一个完整结构：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/016-708d5b75.png)

**注意：LSM-tree 不是一种数据结构，是数据组织的一种方式**

### 二叉索引树/斐波那契树

一种紧凑且高效的数据结构，用于处理动态累积频率表或前缀和。换句话说，它非常适合用于区间查询。

树结构存储在一个数组中，其中数组中每个 2 的幂次方索引位置保存其之前所有元素的累积和。举个例子，第 4 个元素（值为 22）存储的是前 4 个元素的和。为了获取树中每个区间的子数组和，我们使用位移操作，使得每次更新和读取的时间复杂度减少到对数级别 O(log(n))，从而提高区间查询的效率。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/017-39f41184.png)

## 图数据结构

### 邻接表与邻接矩阵图表示

一个邻接表将图表示为一系列列表的集合——每个节点都有一个与之相连的节点集合。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/018-65d2c4e4.png)

邻接矩阵将图表示为一个二维矩阵。如果我们的图有 N 个节点，我们将有一个 N×N 的矩阵，其中每个单元格(i, j)表示顶点 i 和顶点 j 之间是否存在边。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/019-bf45bf53.png)

示例图:

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/020-21a98545.png)

## 字符串搜索数据结构

### Trie（字典树）

trie 是一种树形数据结构，用于高效地搜索字符串，其中每个节点代表一个字符，具有包括快速基于前缀的查询和插入等优势。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/021-8f5978f6.png)

### Radix Tree

它也可以被视为一个紧凑的 Trie。尽管 Trie 很棒，但它们可能会占用大量内存。Redix 树通过合并具有公共前缀的节点来解决这个问题

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/022-aa66d395.png)

### Splay Tree

伸展树是一种在数据访问频率不均时具有优秀性能的二叉搜索树。树在查找、插入和删除操作后自动调整。在树中访问一个项目后，树会重新排列，使访问的项目移动到顶部（根）。这使得对该项目的未来访问更快。伸展树在缓存中特别有用。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/023-253c3179.png)

### Quadtree

四叉树是一种空间数据结构，它递归地将二维空间划分为四个象限，使其在管理和查询如点或区域等空间数据时非常高效。如果一个节点包含太多点，它将被细分为四个子节点。四叉树通常用于处理碰撞检测。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/024-bb082c42.png)

### KD Tree

一棵二叉树，其中每个节点代表 k 维空间中的一个点。该树通过递归地在其中一个维度上分割空间来构建。在树的每一层，数据根据一个维度进行分割，后续的每一层交替使用维度。这使得它在范围查询和最近邻搜索中非常高效。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/025-08a899b6.png)

### R-Tree

R 树是一种用于高效索引多维空间数据的树形数据结构。它们将数据组织成最小边界矩形（MBR），这些矩形按层次分组，每个节点的 MBR 包含其子节点的 MBR。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/026-f0eb8de6.png)

## 其他数据结构及图

### 布隆过滤器

布隆过滤器是一种空间高效的概率数据结构，用于测试一个元素是否是集合的成员，通常用于减少对不存在的键的昂贵磁盘（或网络）查找。它可以产生假阳性（报告元素在集合中而实际上不在），但永远不会产生假阴性（如果元素实际上在集合中，它永远不会错误地报告元素不在集合中）。

它使用位数组来存储数据。为了将一个键映射到适当的位，它使用多个独立的哈希函数，每个函数将键映射到位数组中的不同位位置。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/027-513b7c78.png)

### 二叉堆

二叉堆是一种高效管理元素集合的数据结构，支持快速插入、最小元素提取和堆合并。当需要处理频繁执行这些操作的动态元素集合时，它特别有用

二叉堆由一系列二叉树组成，这些树是相互链接的特殊树

**二项式树（0 至 3 阶）：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/028-02e2da9e.png)

每个堆中的二叉树都遵循最小堆属性：节点的键值大于或等于其父节点的键值。此外，每个顺序只能有一个或零个二叉树，包括零阶。

以下示例**二叉堆包含 13 个节点：**

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/029-b64ced71.png)

二叉堆在实现优先队列等场景中很有用，在这些场景中，需要频繁地合并堆或对一组元素执行其他操作。

### Hash Array Mapped Trie (HAMT)

HAMT 是一种结合了哈希表和 Trie 的优点，用于高效存储和检索键值对的数据结构。它在计算机科学中常用于实现关联数组或字典。在 HAMT 中，键被哈希以确定其在数组中的存储位置，该数组称为哈希数组。哈希数组中的每个条目可以存储多个键值对，从而实现高效的内存利用。如果多个键哈希到相同的数组索引，则使用类似 Trie 的结构来解决冲突。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/030-0371cb4b.png)

### Merkle Tree

帮助高效、安全地验证大量数据。它通过将数据组织成树状结构，其中每个叶子节点包含数据块的哈希值，每个非叶子节点是其两个子节点的哈希值，一直向上到顶部的 Merkle 根。这种结构在区块链和其他系统中被广泛使用，以确保数据完整性。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/031-8ee0b831.png)

## 最后：8 个数据库中常用的数据结构

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-11-19-cheng-xu-yuan-bi-bei-zui-zhi-guan-de-shu-ju-jie-gou-tu-wen-s/032-2674b76e.png)
