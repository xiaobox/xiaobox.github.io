---
title: "十大经典排序算法（二）"
slug: 2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er
description: "接上一篇   十大经典排序算法（一）6 快速排序（Quick Sort）快速排序（有时称为分区交换排序）是一"
date: 2020-02-19T15:32:16.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/cover.jpg
original_url: https://mp.weixin.qq.com/s/IjHvvBq0_y4TROtTOCI5ag
categories:
  - 后端
tags:
  - Java
  - 算法
  - 面试
  - 架构
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/001-5a315a8a.jpg)

接上一篇   [十大经典排序算法（一）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247483844&idx=1&sn=af2a74158fd83d15f51c8e70da5d69c2&chksm=eb6dbe42dc1a3754150255bad083ba5f7155911a9144978ce4a76e219987f55a6e9200db3b6d&scene=21#wechat_redirect)

### 6 快速排序（Quick Sort）

快速排序（有时称为分区交换排序）是一种有效的排序算法。由英国计算机科学家Tony Hoare于1959年开发并于1961年发表，它仍然是一种常用的排序算法。如果实施得当，它可以比主要竞争对手（合并排序和堆排序）快两到三倍。快速排序基本上被认为是相同数量级的所有排序算法中，平均性能最好的。

Quicksort是一种**分而治之**的算法。它通过从数组中选择一个“pivot”元素并将其他元素划分为两个子数组（根据它们是否小于或大于枢轴）来工作。然后将子数组递归排序。这种排序方式由于可以就地完成，所以需要少量额外的内存来执行排序。

在平均状况下，排序 n 个项目要 Ο(nlogn) 次比较。在最坏状况下则需要 Ο(n2) 次比较，但这种状况并不常见。事实上，快速排序通常明显比其他 Ο(nlogn) 算法更快，因为它的内部循环（inner loop）可以在大部分的架构上很有效率地被实现出来

其广泛应用的主要原因是高效.**快速排序经常会被作为面试题进行考察**，通常的考察思路是快排思想、编码实践之手写快排以及进一步对快排的优化。事实上在Java标准库中**Arrays类的sort**方法里源码也正是使用了优化后的快速排序，**java 8 中 Arrays.sort并不是单一的排序，而是插入排序，快速排序，归并排序三种排序的组合，**有兴趣的可以看看源码。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/002-1033d48e.jpg)

举个例子 如无序数组[6 2 4 1 5 9]

-   先把第一项[6]取出来,

          用[6]依次与其余项进行比较,

          如果比[6]小就放[6]前边,2 4 1 5都比[6]小,所以全部放到[6]前边

          如果比[6]大就放[6]后边,9比[6]大,放到[6]后边

          //***6出列后大喝一声,比我小的站前边,比我大的站后边,行动吧!霸气十足~***

          一趟排完后变成下边这样:

          排序前 **6** 2 4 1 5 9    排序后 2 4 1 5 **6** 9

-   对前半拉[2 4 1 5]继续进行快速排序

           重复第一步后变成下边这样:

           排序前 **2** 4 1 5       排序后 1 **2** 4 5

           前半拉排序完成,总的排序也完成

           排序前:[6 2 4 1 5 9]   排序后:[1 2 4 5 6 9]

-    排序结束

#### 算法描述

快速排序使用分治法来把一个串（list）分为两个子串（sub-lists）。具体算法描述如下：

-   从数列中挑出一个元素，称为 “基准”（pivot）；

-   重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；

-   递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

#### 动图演示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/003-a15f04da.gif)

#### 代码实现

```swift

import java.util.Arrays;

public class QuickSort {

  public int[] sort(int[] sourceArray) {
    // 对 arr 进行拷贝，不改变参数内容
    int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

    return quickSort(arr, 0, arr.length - 1);
  }

  private int[] quickSort(int[] arr, int left, int right) {

    if (left < right) {
      int partitionIndex = partition(arr, left, right);
      quickSort(arr, left, partitionIndex - 1);
      quickSort(arr, partitionIndex + 1, right);
    }
    return arr;

  }

  private int partition(int[] arr, int left, int right) {

    int pivot = arr[right];
    int index = left;
    for (int i = index; i <= right; i++) {

      if (arr[i] <= pivot) {
        int temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
        index++;
      }

    }
    return index - 1;

  }

}

```

为了便于理解 ，再举个例子，先把数组按最后一个元素4作为分界点，把数组一分为三。除了分界点之外，左子部分全是小于等于4的，右子部分全是大于4的，它们可以进一步递归排序。该算法的**核心**是：**如何把数组按分界点一分为三**？

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/004-fc42bf70.jpg)

具体过程是这样的，选取最后一个元素为分界点，然后遍历数组找小于等于分界点的元素，然后往数组前面交换。比如：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/005-926b2075.jpg)

上图中，我们按顺序找小于等于4的元素，共1、2、3、4。然后分别与数组的前4个元素交换即可，结果自然是一分为三。

#### 基准的选择

-   基准普遍的有三种选择方法：
    固定基准元，一般选取中间值或头部值或尾部值。如果输入序列是随机的，处理时间是可以接受的。如果数组已经有序时或部分有序，此时的分割就是一个非常不好的分割。因为每次划分只能使待排序序列减一，数组全部有序时，此时为最坏情况，快速排序沦为冒泡排序，时间复杂度为O(n^2)。所以此种方式要慎用。

-   随机基准元，这是一种相对安全的策略。由于基准元的位置是随机的，那么产生的分割也不会总是会出现劣质的分割。在整个数组数字全相等时，仍然是最坏情况，时间复杂度是O(n^2）。实际上，随机化快速排序得到理论最坏情况的可能性仅为1/(2^n）。所以随机化快速排序可以对于绝大多数输入数据达到O(nlogn）的期望时间复杂度。

-   三数取中，一般是分别取出数组的**头部元素，尾部元素和中部元素**， 在这三个数中取出中位数，作为基准元素。最佳的划分是将待排序的序列分成等长的子序列，最佳的状态我们可以使用序列的中间的值，也就是第N/2个数。可是，这很难算出来，并且会明显减慢快速排序的速度。这样的中值的估计可以通过随机选取三个元素并用它们的中值作为枢纽元而得到。事实上，随机性并没有多大的帮助，因此一般的做法是使用左端、右端和中心位置上的三个元素的中值作为枢纽元。显然使用三数中值分割法消除了预排序输入的不好情形。（简单来说，就是随机取三个数，取中位数）。

#### 优化思路

-   当待排序序列的长度分割到一定大小后，使用插入排序。

           jdk8的源码也是这么写的 （注意注释部分，这里INSERTION\_SORT\_THRESHOLD = 47）

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/006-869dd8cd.jpg)

         原因：对于很小和部分有序的数组，快排不如插排好。当待排序序列的长度分割到一定大小后，继续分割的效率比插入排序要差，此时可以使用插排而不是快排。

-   合理选择pivot

     pivot选取的理想情况是：让分区中比 pivot 小的元素数量和比 pivot 大的元素数量差不多。较常用的做法是三数取中（ midian of three ），即从第一项、最后一项、中间一项中取中位数作为 pivot。当然这并不能完全避免最差情况的发生。所以很多时候会采取更小心、更严谨的 pivot 选择方案（对于大数组特别重要）。比如先把大数组平均切分成左中右三个部分，每个部分用三数取中得到一个中位数，再从得到的三个中位数中找出中位数。

-   优化递归操作

    快排函数在函数尾部有两次递归操作，我们可以对其使用尾递归优化（然而并不是所有语言都支持尾递归）

　　   优点：如果待排序的序列划分极端不平衡，递归的深度将趋近于n，而栈的大小是很有限的，每次递归调用都会耗费一定的栈空间，函数的参数越多，每次递归耗费的空间也越多。

           优化后，可以缩减堆栈深度，由原来的O(n)缩减为O(logn)，将会提高性能。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/007-085a3b5e.png)

-   改进划分的策略（可以参考 https://segmentfault.com/a/1190000014960548）

    jdk8 DualPivotQuicksort 使用了一种称为 五取样划分 的策略对数组进行划分，类似于 BFPRT 算法。

-   双枢轴（可以参考 https://segmentfault.com/a/1190000014960548）

     即将数组三切分(大于枢轴，等于枢轴，小于枢轴），可以证明这样是熵最优的并且更高效。为什么这样划分呢？因为统计表明对大规模数组进行排序时，数据重复的情况比较多，因此使用双枢轴可以有效避免相等元素之间的比较。以 Java 标准库为例，JDK 1.8 中的 DualPivotQuicksort 实现了一种 快速三向切分 的快速排序，它通过将相等元素聚集起来的方式使熵最优（原理：将相等元素聚集起来，不必再切分这些元素）。

-   其他未写到，或更加丧心病狂的方法![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/008-454a15a2.png)

参考：

-   https://www.programcreek.com/2012/11/quicksort-array-in-java/

-   https://juejin.im/post/5d75f77e5188253e4b2f0d3d

-   https://www.kancloud.cn/maliming/leetcode/740422

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-19-shi-da-jing-dian-pai-xu-suan-fa-er/009-99bd5eef.jpg)

**关注公众号 获取更多精彩内容**
