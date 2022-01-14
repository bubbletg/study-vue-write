let id = 0
/**
 * 用来收集依赖， 收集一个个的watcher
 */
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  /**
   * 订阅
   * @param {*} subs
   */
  addSub(watcher) {
    this.subs.push(watcher)
  }
  /**
   * 派发更新
   */
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  /**
   * 让 每一个 wather 也添加 dep 一一对应
   */
  depend() {
    // 防止直接调用
    if (Dep.target) {
      // Dep.target 是一个渲染 wather ,让 wather 也有dep
      Dep.target.addDep(this)
    }
  }
}

/**
 *  watcher 队列
 */
let stack = []
/**
 * 用来保存当前watcher
 * @param {*} watcher
 */
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget(watcher) {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep
