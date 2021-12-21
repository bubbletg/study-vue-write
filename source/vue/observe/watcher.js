import Dep, { popTarget, pushTarget } from "./dep"
import { util } from "../util"

let id = 0
class Watcher {
  // 每次产生的Watcher 都是唯一的，有唯一标识
  /**
   *
   * @param {*} vm 当前组件的实例 new Vue
   * @param {*} exporOrFn 传人的一个表达式或者是函数
   * @param {*} cb 回调函数， vm.$watch('masg',cb)
   * @param {*} opts 其他参数
   */
  constructor(vm, exporOrFn, cb = () => {}, opts = () => {}) {
    this.vm = vm
    this.exporOrFn = exporOrFn
    if (typeof exporOrFn === "function") {
      this.getter = exporOrFn
    } else {
      // this.$watch 调用时候 走此逻辑
      this.getter = function () {
        // 将vm 上对应的表达式取出来
        return util.getValue(vm, exporOrFn)
      }
    }
    // 标识用户自己写的watcher
    if (opts.user) {
      this.user = true
    }
    this.cb = cb
    this.opts = opts
    this.deps = []
    this.depsId = new Set()
    this.id = id++

    this.immediate = opts.immediate
    // get 第一次调用的时候是老值,第二次是新值
    // 创建 watcher 的时候，先将表达式对应的值取出来（老值）
    this.value = this.get() // 默认会创建一个 Watcher ，调用此方法
    if (this.immediate) {
      this.cb(this.value)
    }
  }
  get() {
    pushTarget(this) // 渲染 watcher
    let value = this.getter() // 执行传入的函数
    popTarget()
    return value
  }

  addDep(dep) {
    //同一个 watcher 不应该重复记录dep
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep) // 让watcher 记录了dep
      dep.addSub(this)
    }
  }
  update() {
    queueWatcher(this) //
  }
  run() {
    // 拿到get 执行后的新值
    let value = this.get()
    // this.value 为 老值 ，这里判断新老值是否相等
    if (this.value !== value) {
      //  不相等说明 value 变化，执行用户watch 函数 cb
      this.cb(value, this.value)
    }
    return value
  }
}

let has = {}
let queue = []
function flushQueue() {
  // 等待当前这一轮全部更新后，再去让watcher 依次执行
  queue.forEach(watcher => watcher.run())
  has = {}
  queue = []
}
function queueWatcher(watcher) {
  let id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)

    // 延迟清空队列
    nextTick(flushQueue) // 异步方法执行会等待所有同步方法执行完
  }
}

let callbacks = []
function flushCallbacks() {
  callbacks.forEach(cb => cb())
}
function nextTick(cb) {
  callbacks.push(cb)

  // 异步刷新 callbacks
  // 异步 执行顺序 promis mutationOvserver setImmediate setTimeout

  let timerFunc = () => {
    flushCallbacks()
  }

  if (Promise) {
    return Promise.resolve().then(timerFunc)
  }
  if (MutationObserver) {
    let observe = new MutationObserver(timerFunc)
    let textNode = document.createTextNode(1)
    observe.observe(textNode, { characterData: true })
    textNode.textContent = 2
    return
  }
  if (setImmediate) {
    return setImmediate(timerFunc)
  }
  setTimeout(timerFunc, 0)
}
// 渲染，计算属性， vm.watch 都用该类
export default Watcher

// 1. 默认会创建一个渲染watcher ,这个渲染 watcher 默认会执行
// 2.
// pushTarget(this)   Dep.target = watcher
// this.getter()      调用【当前属性的get方法】 给当前属性添加一个 dep ==> dep.addSub(watcher)
// popTarget()
// 3. 当用户修改了属性变化后，会调用set方法
// dep.notify()
