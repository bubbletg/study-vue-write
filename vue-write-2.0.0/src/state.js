import { observe } from "./observer/index"
import { proxy } from "./util/index"
import Watcher from "./observer/watcher"
import Dep from './observer/dep'
export function stateMixin(Vue) {
  Vue.prototype.$watch = function (key, handler, options = {}) {
    options.user = true // 说明当前watcher 是一个用户watcher
    let watcher = new Watcher(this, key, handler, options)
    if (options.immediate) {
      handler(watcher.value)
    }
  }
}

export function initState(vm) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm, opts.computed)
  }
  if (opts.watch) {
    initWatch(vm, opts.watch)
  }
}

function initProps(vm) {}

function initMethods(vm) {}

/**
 *  初始化数据
 * @param {*} vm
 */
function initData(vm) {
  let data = vm.$options.data
  // data 有可能是一个函数，也有可能是一个对象
  // 同时将 data  挂载到 vm._data 上
  data = vm._data = typeof data === "function" ? data.call(vm) : data
  // 代理
  for (let key in data) {
    proxy(vm, "_data", key) // 将vm 上的取值和赋值操作代理在vm._data 上
  }
  // 对象劫持 用户改变数据，我可以得到通知。 MVVM 模型
  // 通过 Object.defineProperty， 不兼容ie8以下
  // Object.defineProperty(data)
  observe(data)
}

function initComputed(vm, computed) {
  const watchers =vm._computedWatchers = {}
  for (let key in computed) {
    const userDef = computed[key]
    //计算属性： 依赖的属性变化就重新取值
    let getter = typeof userDef === "function" ? userDef : userDef.get
    // 每个计算属性本质就是 watcher
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true }) // lazy: true 标记默认不执行
    // 把 computed 的key 定义（代理）在vm上
    defineComputed(vm, key, userDef)
  }
}

function defineComputed(vm, key, userDef) {
  let sharedProperty = {}
  if (typeof userDef === "function") {
    sharedProperty.get = createComputedGetter(key)
  } else {
    sharedProperty.get = createComputedGetter(key)
    sharedProperty.set = userDef.set
  }
  Object.defineProperty(vm, key, sharedProperty)
}

function createComputedGetter(key) {
  return function computedGetter() {
    // _computedWatchers 包含所有的计算属性
    // 通过 key 拿到对应的watcher, 这个 watcher 包含了 getter
    let watcher = this._computedWatchers[key]
    // 根据 dirty 来判断是否重新求值
    if (watcher.dirty) {
      watcher.evaluate()
    }

    if (Dep.target) {
      // 当 计算属性取完值后，Dep.target 还是有值，需要继续向上收集
      watcher.depend() // 计算属性依赖收集
    }
    return watcher.value
  }
}

function initWatch(vm, watch) {
  for (let key in watch) {
    let handler = watch[key]
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatch(vm, key, handler[i])
      }
    } else {
      createWatch(vm, key, handler)
    }
  }
}

function createWatch(vm, key, handler) {
  return vm.$watch(key, handler)
}
