
const queue: any = []

export function queueJob(job: any) {
  // job 就是 effect ，一个组件只有一个effect
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush();
  }
}

// 是否在刷新中
let isFlushPending = false
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true
    Promise.resolve().then(flushJobs)
  }
}


/**
 * 清空队列任务
 */
function flushJobs() {
  isFlushPending = false
  // 清空时候，我们根据组件调用顺序刷新，从父到子的刷新
  queue.sort((a: any, b: any) => a.id - b.id)

  for (let i = 0; i < queue.length; i++) {
    const job = queue[i]
    job()
  }
  queue.length = 0
}


