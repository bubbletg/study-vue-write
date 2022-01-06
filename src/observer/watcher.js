import { pushTarget, popTarget } from "./dep"
import { queueWatcher } from "./schedular"

let id = 0
export default class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.callback = callback
    this.options = options
    this.id = id++

    this.user = !!options.user

    this.depsId = new Set() // 保存Dep 的id
    this.deps = [] // 保存 dep

    if (typeof exprOrFn === "string") {
      // 用户 watch 时候
      this.getter = function () {
        // 将表达式转换为函数
        let path = exprOrFn.split(".")
        let obj = vm
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj // 取值，会对用户watcher 收集起来
      }
    } else {
      this.getter = exprOrFn //渲染watcher 传过来 exprOrFn 是一个方法
    }
    this.value = this.get()
  }
  get() {
    pushTarget(this) // 把当前watcher 存起来
    const vlaue = this.getter()
    popTarget()
    return vlaue
  }
  update() {
    queueWatcher(this)
  }
  run() {
    let newValue = this.get()
    let oldVnode = this.value
    this.value = newValue // 为了保证下一次的更新时，上一次的最新值是下一次的老值
    if (this.user) { // 使用户watcher 执行回调
      this.callback(newValue, oldVnode)
    }
  }
  /**
   * 当前watcher 添加一个 dep ,同时这个 dep 也添加上 这个watcher
   * @param {*} dep
   */
  addDep(dep) {
    // watcher 里不能放重复的dep,Dep 不能放重复的watcher
    let id = dep.id
    // 判断当前 watcher 是否保存了dep
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
}
