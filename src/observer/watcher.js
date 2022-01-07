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

    // 标记用户watcher
    this.user = !!options.user

    // 计算属性，标记为true
    this.lazy = !!options.lazy
    // 判断是否脏数据， 用于计算属性缓存
    this.dirty = options.lazy

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

    // this.lazy 计算属性时候，new Watcher 的lazy为true ，第一次不执行
    this.value = this.lazy ? undefined : this.get()
  }
  get() {
    pushTarget(this) // 把当前watcher 存起来
    const vlaue = this.getter.call(this.vm)
    popTarget()
    return vlaue
  }
  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    let newValue = this.get()
    let oldVnode = this.value
    this.value = newValue // 为了保证下一次的更新时，上一次的最新值是下一次的老值
    if (this.user) {
      // 使用户watcher 执行回调
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
  /**
   * 计算属性取值使用
   */
  evaluate() {
    this.dirty = false // 标识计算属性取过值了
    this.value = this.get() // 执行计算属性的用户getter
  }

  /**
   * 计算属性依赖收集
   * 实际上是计算属性的依赖属性再次收集依赖
   */
  depend() {
    // 这里的deps 是 计算属性依赖的属性的deps
    let i = this.deps.length
    while (i--) {
      // 让计算属性里依赖的属性 收集依赖,
      // 这里收集的是渲染watcher,
      // 目的是 计算属性依赖的属性变化是，触发渲染watcher 更新
      this.deps[i].depend()
    }
  }
}
