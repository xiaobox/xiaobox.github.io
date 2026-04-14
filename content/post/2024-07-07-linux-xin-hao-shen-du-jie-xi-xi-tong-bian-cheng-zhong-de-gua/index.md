---
title: "Linux信号深度解析：系统编程中的关键通信手段"
slug: 2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua
description: "为什么需要信号？Linux 计算机系统中有许多处于不同状态的进程。这些进程要么属于用户应用程序，要么属于操作系统。"
date: 2024-07-07T04:55:49.000Z
image: https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/cover.jpg
original_url: https://mp.weixin.qq.com/s/QkUoJ_wRBwkWVl_tHeigdw
categories:
  - 系统底层
tags:
  - Linux
  - macOS
---
## 为什么需要信号？

Linux 计算机系统中有许多处于不同状态的进程。这些进程要么属于用户应用程序，要么属于操作系统。我们需要一种机制来协调内核和这些进程的活动。其中一种方法就是让进程在发生重要事件时通知其他进程。这就是为什么我们需要信号。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/001-3b64d29f.png)

信号基本上是一种单向通知。信号可以由内核发送给一个进程，也可以由一个进程发送给另一个进程，还可以由一个进程发送给自己。

Linux 信号起源于 Unix 信号。在后来的 Linux 版本中，加入了实时信号。信号是一种简单、轻量级的进程间通信方式，因此非常适合嵌入式系统。

### 关于 Linux 信号一些基本知识

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/002-1e8cfb98.png)

共有 31 个标准信号，编号为 1-31。每个信号都以 "SIG "命名，后跟一个后缀。

在 macOS 的命令行中执行 `man 3 signal` ，可以看到：

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/003-ed3e068c.png)

从 2.2 版开始，Linux 内核支持 33 种不同的实时信号。这些信号的编号为 32-64，但程序员应该使用 SIGRTMIN+n 符号。标准信号有特定用途，但 SIGUSR1 和 SIGUSR2 的使用可由应用程序定义。实时信号也由应用程序定义。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/004-b75082be.png)

### 为什么没有 0 信号？

0 号信号（POSIX.1 将其称为空信号）一般不使用，但 kill 函数将其作为特例使用。不会发送任何信号，但可以使用它（相当不可靠）来检查进程是否仍然存在

以下是一个使用 C 语言编写的示例代码，展示了如何使用kill函数和 0 号信号来检查进程是否存在：

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <signal.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <pid>\n", argv[0]);
        return 1;
    }

    pid_t pid = atoi(argv[1]);
    if (kill(pid, 0) == 0) {
        printf("Process with PID %d exists.\n", pid);
    } else {
        perror("kill");
        printf("Process with PID %d does not exist or you don't have permission to signal it.\n", pid);
    }

    return 0;
}

```

请注意，**这种方法并不是百分之百可靠的，因为在一个进程终止和其 PID 被重新分配给另一个进程之间的短暂时间内，可能会出现检查结果不准确的情况。此外，如果目标进程是由不同用户运行的，并且没有适当的权限，kill函数也可能返回错误。因此，这种方法应该只作为一种粗略的检查手段，而不是作为严格的进程存在的验证。**

### 推荐使用 sigaction 而不是 signal 函数来处理信号

Linux 实现的信号完全符合 POSIX 标准。较新的实现应优先使用 sigaction，而不是传统的信号接口。

signal 函数是一个较旧的函数，用于设置一个信号的处理函数。它的原型如下：

```
void (*signal(int sig, void (*func)(int)))(int);

```

你可以使用 signal 函数来为特定的信号设置一个处理函数。例如，下面的代码为 SIGINT（通常是用户按 Ctrl+C 时发送的信号）信号设置了一个处理函数：

```c
#include <signal.h>
#include <stdio.h>
#include <unistd.h>

void handle_sigint(int sig) {
    printf("Caught signal %d\n", sig);
}

int main() {
    signal(SIGINT, handle_sigint);
    while (1) {
        printf("Hello, World!\n");
        sleep(1);
    }
    return 0;
}

```

我们来看看 sigaction 函数。这个函数提供了更多的方式来控制信号的行为。它的原型如下：

```
int sigaction(int sig, const struct sigaction *act, struct sigaction *oldact);

```

sigaction 函数使用一个 sigaction 结构体来指定信号的处理方式，这个结构体包含了信号处理函数、信号掩码和其它选项。下面是使用 sigaction 的一个例子

```c
#include <signal.h>
#include <stdio.h>
#include <unistd.h>

void handle_sigint(int sig, siginfo_t *si, void *uc) {
    printf("Caught signal %d\n", sig);
}

int main() {
    struct sigaction sa;
    sa.sa_flags = SA_SIGINFO;
    sa.sa_sigaction = handle_sigint;
    sigemptyset(&sa.sa_mask);

    if (sigaction(SIGINT, &sa, NULL) == -1) {
        perror("sigaction");
        return 1;
    }

    while (1) {
        printf("Hello, World!\n");
        sleep(1);
    }
    return 0;
}

```

在这个例子中，我们使用 sigaction 来为 SIGINT 设置信号处理函数 handle\_sigint。我们设置了 SA\_SIGINFO 标志，这意味着信号处理函数可以接收额外的信息，如信号编号和发送信号的进程信息。

**为什么推荐使用 sigaction 而不是 signal 呢？**原因是：

1.  功能强大：sigaction 允许你更精细地控制信号的处理，例如设置信号掩码来在信号处理函数执行期间阻塞特定的信号。
2.  可靠性：signal 在某些系统上可能不是线程安全的，而 sigaction 则没有这个问题。
3.  向后兼容：虽然 sigaction 是 POSIX 标准引入的，但它也提供了与 signal 的向后兼容性。通过适当的使用 sa\_flags 参数，可以模拟 signal 的行为。
4.  符合标准：使用 sigaction 可以确保代码的便携性，因为它遵循了 POSIX 标准，这意味着在所有遵循 POSIX 标准的操作系统中，sigaction 的行为都是一致的。

### 硬中断与软中断

正如硬件子系统可以中断处理器一样，信号也可以中断进程的执行。因此，它们被视为软件中断。中断处理程序处理硬件中断，信号处理程序处理信号。

一些信号映射到特定的按键输入：

-   SIGINT 对应 ctrl+c
-   SIGSTOP 对应 ctrl+z
-   SIGQUIT 对应 ctrl+\\

## 信号如何影响 Linux 进程的状态？

-   有些信号会终止接收进程：sighup、sigint、sigterm、sigkill
-   有一些信号在终止进程的同时会产生内核转储，以帮助程序员调试出错的原因：SIGABRT（终止信号）、SIGBUS（总线错误）、SIGILL（非法指令）、SIGSEGV（无效内存引用）、SIGSYS（不良系统调用）
-   有些信号会停止进程：SIGSTOP、SIGTSTP

> “
> 
> 程序可以覆盖默认行为。例如，可以编写一个交互式程序来忽略SIGINT（由ctrl+c输入生成）。两个值得注意的例外是SIGKILL和SIGSTOP信号，它们不能以这种方式被忽略、阻止或覆盖

下面的例子中将用到以下信号：

-   SIGSTOP: 这个信号导致接收它的进程停止，但不会终止。进程保持在停止状态，直到收到 SIGCONT 信号。
-   SIGCHLD: 当子进程改变其状态（例如，停止、继续或终止）时，父进程会收到这个信号。
-   SIGCONT: 这个信号会使停止的进程继续执行

我们通过一个示例来演示父进程和子进程之间的这些信号交互：

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <signal.h>

void handle_sigchld(int sig) {
    printf("Parent received SIGCHLD\n");
}

int main() {
    pid_t pid = fork();

    if (pid == 0) {
        // Child process
        printf("Child process is stopping itself...\n");
        kill(getpid(), SIGSTOP);
        printf("Child process is continuing...\n");
        sleep(1); // Simulate some work
        printf("Child process is exiting...\n");
        exit(0);
    } else if (pid > 0) {
        // Parent process
        signal(SIGCHLD, handle_sigchld);
        printf("Parent process is waiting for child to stop...\n");
        pause(); // Wait for SIGCHLD
        printf("Parent is signaling child to continue...\n");
        kill(pid, SIGCONT);
        printf("Parent is waiting for child to exit...\n");
        wait(NULL); // Wait for child to exit
        printf("Parent process is done.\n");
    } else {
        // Fork failed
        perror("fork");
        exit(1);
    }

    return 0;
}

```

1.  父进程创建子进程：父进程使用 fork() 系统调用创建一个子进程。
2.  子进程发送 SIGSTOP 给自己：子进程使用 kill() 系统调用向自己发送 SIGSTOP 信号，导致子进程停止。
3.  父进程收到 SIGCHLD 信号：因为子进程的状态发生了变化，父进程会收到一个 SIGCHLD 信号。
4.  父进程发送 SIGCONT 给子进程：父进程可以使用 kill() 系统调用来发送 SIGCONT 信号给子进程，使其从停止状态继续执行。
5.  子进程继续执行：子进程收到 SIGCONT 信号后，会从停止状态恢复，并继续执行。
6.  父进程再次收到 SIGCHLD 信号：因为子进程的状态再次发生了变化（从停止到继续），父进程会再次收到一个 SIGCHLD 信号。
7.  子进程退出：子进程完成后，它会退出。这会向父进程发送另一个 SIGCHLD 信号。
8.  父进程处理子进程的退出：父进程需要调用 wait() 或 waitpid() 系统调用来获取子进程的状态信息，并防止子进程成为僵尸进程。

以下为流程示意图：![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/005-d11e0874.png)

### 信号与异常类似吗？

有些编程语言可以使用 try-throw-catch 等结构来处理异常。信号与异常并不相似。相反，失败的系统或库调用会返回非零的退出代码。当进程被终止时，它的退出代码将是 128 加上信号号。例如，被 SIGKILL 杀死的进程将返回 137 (128+9)

### Linux信号是同步的还是异步的？

Linux信号可以是同步的也可以是异步的，这取决于信号的触发方式和发送时机。

**同步信号**是由于指令导致了不可恢复的错误（如非法地址访问）而产生的。这些信号会发送给导致错误的线程。比如

-   当进程执行了一个非法操作（如访问非法内存、除以零等）时，内核会同步地发送一个信号（如 SIGSEGV）给该进程。
-   当进程接收到一个系统调用（如 `read`、`write`）的请求时，如果该请求不能立即完成，进程可能会被同步地挂起，直到请求完成或超时。

这些信号也被称为陷阱，因为它们也会向内核陷阱处理程序发送陷阱信号。

**异步信号**是当前执行上下文的外部信号（是由其他进程或内核在某个事件发生时发送给目标进程的）从另一个进程发送 SIGKILL 就是一个例子。这些信号也称为软件中断。比如：

-   当一个进程想要通知另一个进程某个事件已经发生时，它会发送一个信号（如 SIGUSR1）给目标进程。这是一种典型的异步通信方式。
-   当子进程改变其状态（例如，停止、继续或终止）时，内核会异步地发送 SIGCHLD 信号给父进程。父进程可以注册一个信号处理函数来处理这个信号，例如，获取子进程的状态信息或者防止子进程成为僵尸进程。

## 信号的典型生命周期是怎样的？

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/006-605fcf51.png)

信号经过三个阶段：

1.  生成：信号可由内核或任何进程生成。无论谁生成信号，都会将其发送给特定进程。信号用数字表示，没有额外的数据或参数。因此，信号是轻量级的。不过，POSIX 实时信号可以传递额外的数据。可以产生信号的系统调用和函数包括 raise、kill、killpg、pthread\_kill、tgkill 和 sigqueue

2.  传递：一个信号在被传递之前被称为待处理信号。通常情况下，内核会尽快向进程发送信号。但是，如果进程阻塞了信号，它将一直处于待处理状态，直到被解除阻塞为止

3.  处理：信号一旦发出，就会以多种方式之一进行处理。

    对于非默认行为，可以调用处理函数。具体会发生哪种情况，可通过 sigaction 函数指定

-   每个信号都有一个相关的默认操作：忽略信号；
-   或终止进程，有时会进行核心转储；
-   或停止/继续进程。

### 阻塞和解除阻塞信号

信号会中断程序的正常执行流程。当进程正在执行一些关键代码或更新与信号处理器共享的数据时，这种情况是不可取的。阻塞可以解决这个问题。但代价是信号处理会延迟

每个进程都可以指定是否要阻止某个特定信号。如果被阻止，而信号确实发生了，操作系统将把信号作为待处理信号保留。一旦进程解除阻塞，信号就会发送。当前阻塞信号的集合称为信号掩码。

无限期地阻塞信号是没有意义的。因此，进程可以在信号发送后忽略它。

一个进程屏蔽的信号不会影响其他进程，其他进程可以正常接收信号。

信号屏蔽可以使用 sigprocmask（单线程）或 pthread\_sigmask（多线程）设置。当一个进程有多个线程时，可以按线程阻塞信号。信号将传递给任何一个未阻塞它的线程。

**信号处理器以进程为单位，信号屏蔽以线程为单位。**

### 一个进程可以有多个待发信号吗？

是的，一个进程可以有许多标准信号待处理。但是，特定信号类型只能有一个实例处于待处理状态。这是因为信号的挂起和阻塞是作为位掩码实现的，每个信号类型只有一个位。

![Image](https://pub-f29bf2b53160470c9a85250116509a24.r2.dev/post/2024-07-07-linux-xin-hao-shen-du-jie-xi-xi-tong-bian-cheng-zhong-de-gua/007-5b4bfd5a.png)

例如，我们可以同时挂起 SIGALRM 和 SIGTERM 信号，但不能挂起两个 SIGALRM 信号。即使 SIGALRM 信号被多次触发，进程也只会收到一个 SIGALRM 信号

对于实时信号，信号可以与数据一起排队，这样每个信号实例都可以单独传递和处理。

POSIX 并未规定标准信号的传送顺序，也未说明如果标准信号和实时信号都待处理会发生什么情况。Linux 优先处理标准信号。对于实时信号，编号较低的信号先发送，如果一个信号类型有多个队列，则最早的一个先发送。
