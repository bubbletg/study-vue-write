import { observe, proxy } from "./observer/index"


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
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
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

function initComputed(vm) {}

function initWatch(vm) {}
