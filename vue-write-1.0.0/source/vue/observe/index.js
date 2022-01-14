import Observer from "./observer"
import Watcher from "./watcher"
import Dep from './dep'

export function initState(vm) {
  // 做不同的初始化
  let opts = vm.$options
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
function initData(vm) {
  // 通过 Object.defineProperty 重新定义数据
  let data = vm.$options.data
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {}

  // 代理
  for (let key in data) {
    proxy(vm, "_data", key) // 将vm 上的取值和赋值操作代理在vm._data 上
  }

  observe(vm._data) // 观察数据
}

function createComputedGetter(vm, key) {
  let watcher = vm._watchersComputed[key]
   // 计算属性 用户取值时，调用该方法
  return function () {
    if (watcher) {
      // 如果 dirty 是 false ，不需要重新执行计算属性中的方法
      if (watcher.dirty) {
        watcher.evaluate()
      }
      // 这里 Dep.target/watcher 是计算属性的watcher 
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}

function initComputed(vm, computed) {
  let watchers = (vm._watchersComputed = Object.create(null)) // 创建存储计算属性的watcher的对象
  for (let key in computed) {
    let userDef = computed[key]
    // 新创建的时候什么也不做, 配置了 lazy dirty
   watchers[key] = new Watcher(vm, userDef, () => {}, { lazy: true })
    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key)
    })
  }
}

function initWatch(vm, watch) {
  // let watch = vm.$options.watch // 获取用户传入的watch 属性
  for (let key in watch) {
    let userDef = watch[key]
    let handler = userDef
    if (userDef.handler) {
      // handler 为 watcher 的方法
      handler = userDef.handler
    }
    createWatcher(vm, key, handler, { immediate: userDef.immediate })
  }
}



function createWatcher(vm, key, handler, opts) {
  return vm.$watch(key, handler, opts)
}

export function observe(data) {
  if (typeof data !== "object" || data == null) {
    return
  }
  return new Observer(data)
}

export function proxy(vm, source, key) {
  // 代理数据 vm.msg = vm._data.msg
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}
