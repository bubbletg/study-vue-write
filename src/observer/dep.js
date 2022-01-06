let id = 0
export default class Dep {
  constructor() {
    this.id = id++
    this.subs = [] // 保存 watcher
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  /**
   * 依赖收集 
   * 在 vm 获取值的时候调用，因为每一个vm 属性对应一个watcher ,Dep.target 是当前属性的watcehr
   * 这里就是 给当前属性的watcehr 添加一个Dep,添加上的这个Dep也会添加上这个watcher
   */
  depend() {
    Dep.target.addDep(this)
    // this.subs.push(Dep.target)
  }
  /**
   * 派发更新
   */
  notify() {
    // 所有的 watcher 更新
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

let stack = []

/**
 * 保存 watcher
 * @param {*} watcher
 */
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

/**
 * 移除 watcher
 */
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
