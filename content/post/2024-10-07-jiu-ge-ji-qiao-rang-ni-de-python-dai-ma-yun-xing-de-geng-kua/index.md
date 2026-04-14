---
title: "九个技巧，让你的Python代码运行得更快！"
slug: 2024-10-07-jiu-ge-ji-qiao-rang-ni-de-python-dai-ma-yun-xing-de-geng-kua
date: 2024-10-07T14:27:36.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-10-07-jiu-ge-ji-qiao-rang-ni-de-python-dai-ma-yun-xing-de-geng-kua/cover.jpg
original_url: https://mp.weixin.qq.com/s/qZjPEAqCr3MsydON7wSIdw
categories:
  - 杂谈
tags:
  - Python
  - 数据结构
---
在编程语言的讨论中，我们经常听到 “Python 太慢了” 的声音，这往往掩盖了 Python 的许多优点。但事实上，如果你能以 Pythonic 的方式编写代码，Python 可以非常快。

细节决定成败。经验丰富的 Python 开发者拥有一系列微妙而强大的技巧，这些技巧可以显著提高代码的性能。

这些技巧乍一看可能微不足道，但它们可以带来效率的大幅提升。让我们深入探讨这 9 种方法，改变你编写和优化 Python 代码的方式。

## 1. 更快的字符串连接：巧妙选择 "join()" 或 "+"

如果有很多字符串需要处理，字符串连接就会成为 Python 程序的瓶颈。

在 Python 中，字符串连接基本上有两种方式：

-   使用`join()`函数将一个字符串列表合并为一个
-   使用`+`或`+=`符号将每个字符串添加到一个字符串中

那么哪种方式更快呢？

让我们来定义 3 个不同的函数来连接相同的字符串：

```python
mylist = ["Yang", "Zhou", "is", "writing"]

# 使用'+'
def concat_plus():
    result = ""
    for word in mylist:
        result += word + " "
    return result

# 使用'join()'
def concat_join():
    return " ".join(mylist)

# 直接连接字符串，不使用列表
def concat_directly():
    return "Yang" + "Zhou" + "is" + "writing"

```

根据你的第一印象，你认为哪个函数最快，哪个最慢？

实际结果可能会让你惊讶：

```python
import timeit

print(timeit.timeit(concat_plus, number=10000))
# 0.002738415962085128
print(timeit.timeit(concat_join, number=10000))
# 0.0008482920238748193
print(timeit.timeit(concat_directly, number=10000))
# 0.00021425005979835987

```

如上所示，对于连接一个字符串列表，`join()`方法比在 for 循环中逐个添加字符串要快。

原因是直接的。一方面，字符串在 Python 中是不可变数据，在每次`+=`操作中都会创建一个新的字符串并复制旧字符串，这在计算上是昂贵的。

另一方面，`.join()`方法专门优化了字符串的连接。它预先计算结果字符串的大小，然后一次性构建它。因此，它避免了在循环中`+=`操作的开销，因此它更快。

然而，在我们的测试中最快的函数是直接连接字符串字面量。它的高速度是由于：

-   Python 解释器可以在编译时优化字符串字面量的连接，将它们变成单个字符串字面量。没有循环迭代或函数调用，这使得它是一个非常高效的操作。
-   由于所有字符串在编译时都是已知的，Python 可以非常快速地执行此操作，比循环中的运行时连接或甚至优化的`.join()`方法都要快得多。

总之，如果你需要连接一个字符串列表，请选择`join()`而不是`+=`。如果你想直接连接字符串，只需使用`+`即可。

## 2. 更快的列表创建：使用"[]"而不是"list()"

创建列表不是什么大不了的事。有两种常见的方式：

1.  使用`list()`函数
2.  直接使用`[]`

让我们使用一个简单的代码片段来测试它们的性能：

```python
import timeit

print(timeit.timeit('[]', number=10 ** 7))
# 0.1368238340364769
print(timeit.timeit(list, number=10 ** 7))
# 0.2958830420393497

```

如结果所示，执行`list()`函数比直接使用`[]`要慢。

这是因为`[]`是字面量语法，而`list()`是一个构造函数调用。调用函数无疑需要额外的时间。

同样的逻辑，当创建字典时，我们也应该利用`{}`而不是`dict()`。

## 3. 更快的成员测试：使用集合而不是列表

成员检查操作的性能在很大程度上取决于底层数据结构：

```python
import timeit

large_dataset = range(100000)
search_element = 2077

large_list = list(large_dataset)
large_set = set(large_dataset)

def list_membership_test():
    return search_element in large_list

def set_membership_test():
    return search_element in large_set

print(timeit.timeit(list_membership_test, number=1000))
# 0.01112208398990333
print(timeit.timeit(set_membership_test, number=1000))
# 3.27499583363533e-05

```

如上述代码所示，集合中的成员测试比列表中的要快得多。

为什么会这样？

-   在 Python 列表中，成员测试（`element in list`）是通过遍历每个元素直到找到所需元素或到达列表末尾来完成的。因此，此操作的时间复杂度为 O(n)。
-   Python 中的集合是作为哈希表实现的。当检查成员资格（`element in set`）时，Python 使用哈希机制，其平均时间复杂度为 O(1)。

这里的要点是在编写程序时要仔细考虑底层数据结构。利用正确的数据结构可以显著加快我们的代码速度。

## 4. 更快的数据生成：使用推导式而不是 for 循环

Python 中有四种类型的推导式：列表、字典、集合和生成器。它们不仅为创建相对数据结构提供了更简洁的语法，而且比使用 for 循环有更好的性能，因为它们在 Python 的 C 实现中进行了优化。

```python
import timeit

def generate_squares_for_loop():
    squares = []
    for i in range(1000):
        squares.append(i * i)
    return squares

def generate_squares_comprehension():
    return [i * i for i in range(1000)]

print(timeit.timeit(generate_squares_for_loop, number=10000))
# 0.2797503340989351
print(timeit.timeit(generate_squares_comprehension, number=10000))
# 0.2364629579242319

```

上述代码是列表推导式和 for 循环之间的简单速度比较。如结果所示，列表推导式更快。

## 5. 更快的循环：优先使用局部变量

在 Python 中，访问局部变量比访问全局变量或对象的属性要快。

这里有一个实例来证明这一点：

```python
import timeit

class Example:
    def __init__(self):
        self.value = 0

obj = Example()

def test_dot_notation():
    for _ in range(1000):
        obj.value += 1

def test_local_variable():
    value = obj.value
    for _ in range(1000):
        value += 1
    obj.value = value

print(timeit.timeit(test_dot_notation, number=1000))
# 0.036605041939765215
print(timeit.timeit(test_local_variable, number=1000))
# 0.024470250005833805

```

这就是 Python 的工作方式。直观地说，当一个函数被编译时，里面的局部变量是已知的，但其他外部变量需要时间来检索。

这是一个小问题，但我们可以利用它来优化我们在处理大量数据时的代码。

## 6. 更快的执行：优先使用内置模块和库

当工程师们说 Python 时，他们通常指的是 CPython。因为 CPython 是 Python 语言的默认和最广泛使用的实现。

鉴于其大多数内置模块和库都是用 C 语言编写的，C 是一种更快的低级语言，我们应该利用内置的武器库，避免重新发明轮子。

```python
import timeit
import random
from collections import Counter

def count_frequency_custom(lst):
    frequency = {}
    for item in lst:
        if item in frequency:
            frequency[item] += 1
        else:
            frequency[item] = 1
    return frequency

def count_frequency_builtin(lst):
    return Counter(lst)

large_list = [random.randint(0, 100) for _ in range(1000)]

print(timeit.timeit(lambda: count_frequency_custom(large_list), number=100))
# 0.005160166998393834
print(timeit.timeit(lambda: count_frequency_builtin(large_list), number=100))
# 0.002444291952997446

```

上述程序比较了两种计算列表中元素频率的方法。我们可以看到，利用内置的`Counter`来自`collections`模块更快、更整洁、更好。

## 7. 更快的函数调用：利用缓存装饰器进行简单的记忆化

缓存是一种常用的技术，用于避免重复计算并加速程序。

幸运的是，在大多数情况下，我们不需要编写自己的缓存处理代码，因为 Python 为此目的提供了一个现成的装饰器——`@functools.cache`。

例如，以下代码将执行两个斐波那契数生成函数，一个有缓存装饰器，另一个没有：

```python
import timeit
import functools

def fibonacci(n):
    if n in (0, 1):
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

@functools.cache
def fibonacci_cached(n):
    if n in (0, 1):
        return n
    return fibonacci_cached(n - 1) + fibonacci_cached(n - 2)

# 测试每个函数的执行时间
print(timeit.timeit(lambda: fibonacci(30), number=1))
# 0.09499712497927248
print(timeit.timeit(lambda: fibonacci_cached(30), number=1))
# 6.458023563027382e-06

```

结果证明了`functools.cache`装饰器使我们的代码更快。

基本的`fibonacci`函数效率低下，因为在得到`fibonacci(30)`的结果过程中，它多次重新计算相同的斐波那契数。

缓存版本要快得多，因为它缓存了先前计算的结果。因此，它只计算一次每个斐波那契数，后续具有相同参数的调用从缓存中检索。

仅仅添加一个内置装饰器就可以带来如此大的改进，这就是 Pythonic 的意思。😎

## 8. 更快的无限循环：优先选择 "while 1" 而不是 "while True"

要创建一个无限 while 循环，我们可以使用`while True`或`while 1`。

它们性能的差异通常可以忽略不计。但有趣的是，`while 1`稍微快一点。

这是因为`1`是字面量，但`True`是一个需要在 Python 的全局作用域中查找的全局名称，因此需要一个微小的开销。

让我们也在代码片段中检查这两种方式的实际比较：

```python
import timeit

def loop_with_true():
    i = 0
    while True:
        if i >= 1000:
            break
        i += 1

def loop_with_one():
    i = 0
    while 1:
        if i >= 1000:
            break
        i += 1

print(timeit.timeit(loop_with_true, number=10000))
# 0.1733035419601947
print(timeit.timeit(loop_with_one, number=10000))
# 0.16412191605195403

```

如我们所见，`while 1`确实稍微快一点。

然而，现代 Python 解释器（如 CPython）高度优化，这种差异通常可以忽略不计。更不用说`while True`比`while 1`更易读。

## 9. 更快的启动：智能导入 Python 模块

在 Python 脚本的顶部导入所有模块似乎是自然而然的事情。

实际上，我们不必这么做。

此外，如果一个模块太大，按需导入它是一个更好的主意。

```python
def my_function():
    import heavy_module
    # 函数的其余部分

```

如上述代码，`heavy_module`在函数内部导入。这是一种“懒加载”的思想，即导入被推迟到`my_function`被调用时。

这种方法的好处是，如果`my_function`在脚本执行过程中从未被调用，那么`heavy_module`就永远不会被加载，节省了资源并减少了脚本的启动时间。
