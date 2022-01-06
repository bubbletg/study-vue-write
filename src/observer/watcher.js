import { pushTarget, popTarget } from "./dep"

export default class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.callback = callback
    this.options = options

    this.depsId = new Set() // 保存Dep 的id
    this.deps = [] // 保存 dep
    this.getter = exprOrFn  // 
    this.get()
  }
  get() {
    pushTarget(this) // 把当前watcher 存起来
    this.getter()
    popTarget()
  }
  update() {
    this.get()
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
