import Observer from "./observer"

export function initState(vm) {
  // 做不同的初始化
  let opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed()
  }
  if (opts.watch) {
    initWatch(vm)
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
function initComputed() {}

function initWatch(vm) {
  let watch = vm.$options.watch // 获取用户传入的watch 属性
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

function createWatcher(vm, key, handler,opts) {
  return vm.$watch(key,handler,opts)
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
