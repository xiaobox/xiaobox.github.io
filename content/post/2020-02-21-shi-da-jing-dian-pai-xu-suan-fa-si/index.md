---
title: "十大经典排序算法（四）"
slug: 2020-02-21-shi-da-jing-dian-pai-xu-suan-fa-si
description: "这是本系列的最后一篇文章"
date: 2020-02-21T10:55:33.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-21-shi-da-jing-dian-pai-xu-suan-fa-si/cover.jpg
original_url: https://mp.weixin.qq.com/s/qAPHn6O88QzcWoLCQcFUHA
categories:
  - 后端
tags:
  - Java
  - 算法
  - 网络
---
![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-21-shi-da-jing-dian-pai-xu-suan-fa-si/001-45ba8117.jpg)

这是本系列的最后一篇文章，接前文

[十大经典排序算法（一）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247483844&idx=1&sn=af2a74158fd83d15f51c8e70da5d69c2&chksm=eb6dbe42dc1a3754150255bad083ba5f7155911a9144978ce4a76e219987f55a6e9200db3b6d&scene=21#wechat_redirect)

[十大经典排序算法（二）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247483852&idx=1&sn=452fb838414c626059b9ef68b622e489&chksm=eb6dbe4adc1a375c8f9ec120a7d53c1a7630c551e1b93a85ad42fe11ae5413aa62a7c64b8194&scene=21#wechat_redirect)

[十大经典排序算法（三）](http://mp.weixin.qq.com/s?__biz=MzI3Njk5ODg4OQ==&mid=2247483857&idx=1&sn=480985f7a3547226b0febf5f409fc831&chksm=eb6dbe57dc1a37410b6cf8dd1105cd4edb557bf92acd40c3cbcca0b6442fe2d8daf19a23df9f&scene=21#wechat_redirect)

8 计数排序（Counting Sort）

计数排序不是基于比较的排序算法，其核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有确定范围的整数。

计数排序是一个稳定的排序算法。当输入的元素是 n 个 0到 k 之间的整数时，时间复杂度是O(n+k)，空间复杂度也是O(n+k)，其排序速度快于任何比较排序算法。当k不是很大并且序列比较集中时，计数排序是一个很有效的排序算法。

#### 算法描述

-   找出待排序的数组中最大和最小的元素；

-   统计数组中每个值为i的元素出现的次数，存入数组C的第i项；

-   对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）；

-   反向填充目标数组：将每个元素i放在新数组的第C(i)项，每放一个元素就将C(i)减去1。

#### 动图演示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-21-shi-da-jing-dian-pai-xu-suan-fa-si/002-09dd7e99.gif)

#### 代码实现

```cs
public class CountingSort implements IArraySort {

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        int maxValue = getMaxValue(arr);

        return countingSort(arr, maxValue);
    }

    private int[] countingSort(int[] arr, int maxValue) {
        int bucketLen = maxValue + 1;
        int[] bucket = new int[bucketLen];

        for (int value : arr) {
            bucket[value]++;
        }

        int sortedIndex = 0;
        for (int j = 0; j < bucketLen; j++) {
            while (bucket[j] > 0) {
                arr[sortedIndex++] = j;
                bucket[j]--;
            }
        }
        return arr;
    }

    private int getMaxValue(int[] arr) {
        int maxValue = arr[0];
        for (int value : arr) {
            if (maxValue < value) {
                maxValue = value;
            }
        }
        return maxValue;
    }

}

```java

计数排序是一个稳定的排序算法。当输入的元素是 n 个 0到 k 之间的整数时，时间复杂度是O(n+k)，空间复杂度也是O(n+k)，其排序速度快于任何比较排序算法。当k不是很大并且序列比较集中时，计数排序是一个很有效的排序算法。

### 9 桶排序（Bucket Sort）

桶排序是计数排序的升级版。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定。桶排序 (Bucket sort)的工作的原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排）。

为了使桶排序更加高效，我们需要做到这两点：

-   在额外空间充足的情况下，尽量增大桶的数量

-   使用的映射函数能够将输入的 N 个数据均匀的分配到 K 个桶中

同时，对于桶中元素的排序，选择何种比较排序算法对于性能的影响至关重要。

#### 算法描述

-   设置一个定量的数组当作空桶；

-   遍历输入数据，并且把数据一个一个放到对应的桶里去；

-   对每个不是空的桶进行排序；

-   从不是空的桶里把排好序的数据拼接起来。 

#### 动图演示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-21-shi-da-jing-dian-pai-xu-suan-fa-si/003-045d49fe.gif)

#### 代码实现

```cs
public class BucketSort implements IArraySort {

    private static final InsertSort insertSort = new InsertSort();

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        return bucketSort(arr, 5);
    }

    private int[] bucketSort(int[] arr, int bucketSize) throws Exception {
        if (arr.length == 0) {
            return arr;
        }

        int minValue = arr[0];
        int maxValue = arr[0];
        for (int value : arr) {
            if (value < minValue) {
                minValue = value;
            } else if (value > maxValue) {
                maxValue = value;
            }
        }

        int bucketCount = (int) Math.floor((maxValue - minValue) / bucketSize) + 1;
        int[][] buckets = new int[bucketCount][0];

        // 利用映射函数将数据分配到各个桶中
        for (int i = 0; i < arr.length; i++) {
            int index = (int) Math.floor((arr[i] - minValue) / bucketSize);
            buckets[index] = arrAppend(buckets[index], arr[i]);
        }

        int arrIndex = 0;
        for (int[] bucket : buckets) {
            if (bucket.length <= 0) {
                continue;
            }
            // 对每个桶进行排序，这里使用了插入排序
            bucket = insertSort.sort(bucket);
            for (int value : bucket) {
                arr[arrIndex++] = value;
            }
        }

        return arr;
    }

    /**
     * 自动扩容，并保存数据
     *
     * @param arr
     * @param value
     */
    private int[] arrAppend(int[] arr, int value) {
        arr = Arrays.copyOf(arr, arr.length + 1);
        arr[arr.length - 1] = value;
        return arr;
    }

}

```java

什么时候最快?

当输入的数据可以均匀的分配到每一个桶中。

什么时候最慢?

当输入的数据被分配到了同一个桶中。

### 10 基数排序（Radix Sort）

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。由于整数也可以表达字符串（比如名字或日期）和特定格式的浮点数，所以基数排序也不是只能使用于整数。

基数排序是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。

#### 算法描述

-   取得数组中的最大数，并取得位数；

-   arr为原始数组，从最低位开始取每个位组成radix数组；

-   对radix进行计数排序（利用计数排序适用于小范围数的特点）

#### 动图演示

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-21-shi-da-jing-dian-pai-xu-suan-fa-si/004-21d2abbc.gif)

#### 代码实现

```cs
/**
 * 基数排序
 * 考虑负数的情况还可以参考： https://code.i-harness.com/zh-CN/q/e98fa9
 */
public class RadixSort implements IArraySort {

    @Override
    public int[] sort(int[] sourceArray) throws Exception {
        // 对 arr 进行拷贝，不改变参数内容
        int[] arr = Arrays.copyOf(sourceArray, sourceArray.length);

        int maxDigit = getMaxDigit(arr);
        return radixSort(arr, maxDigit);
    }

    /**
     * 获取最高位数
     */
    private int getMaxDigit(int[] arr) {
        int maxValue = getMaxValue(arr);
        return getNumLenght(maxValue);
    }

    private int getMaxValue(int[] arr) {
        int maxValue = arr[0];
        for (int value : arr) {
            if (maxValue < value) {
                maxValue = value;
            }
        }
        return maxValue;
    }

    protected int getNumLenght(long num) {
        if (num == 0) {
            return 1;
        }
        int lenght = 0;
        for (long temp = num; temp != 0; temp /= 10) {
            lenght++;
        }
        return lenght;
    }

    private int[] radixSort(int[] arr, int maxDigit) {
        int mod = 10;
        int dev = 1;

        for (int i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
            // 考虑负数的情况，这里扩展一倍队列数，其中 [0-9]对应负数，[10-19]对应正数 (bucket + 10)
            int[][] counter = new int[mod * 2][0];

            for (int j = 0; j < arr.length; j++) {
                int bucket = ((arr[j] % mod) / dev) + mod;
                counter[bucket] = arrayAppend(counter[bucket], arr[j]);
            }

            int pos = 0;
            for (int[] bucket : counter) {
                for (int value : bucket) {
                    arr[pos++] = value;
                }
            }
        }

        return arr;
    }

    /**
     * 自动扩容，并保存数据
     *
     * @param arr
     * @param value
     */
    private int[] arrayAppend(int[] arr, int value) {
        arr = Arrays.copyOf(arr, arr.length + 1);
        arr[arr.length - 1] = value;
        return arr;
    }
}

```

# 

**基数排序 vs 计数排序 vs 桶排序**

这三种排序算法都利用了桶的概念，但对桶的使用方法上有明显差异：

-   基数排序：根据键值的每位数字来分配桶；

-   计数排序：每个桶只存储单一键值；

-   桶排序：每个桶存储一定范围的数值；

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2020-02-21-shi-da-jing-dian-pai-xu-suan-fa-si/005-1e73da81.jpg)

**关注公众号 获取更多精彩内容**
