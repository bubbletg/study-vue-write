// 主要做一些拦截用户调用的 push shift unshift pop reverse sort splice

import { observe } from "."

let oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = ["push", "shift", "pop", "unshift", "reverse", "sort", "splice"]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // 函数劫持 ，切片编程
    let r = oldArrayProtoMethods[method].apply(this, args)
    // 获得新增数据并缓存
    let inserted
    switch (method) {
      case "push":
      case "unshift":
        inserted = args
        break
      case "splice":
        // args 是 参数数组
        inserted = args.splice(2) // 获取 splice 新增的内容
      default:
        break
    }
    // console.log('===============',this[this.length-1] === inserted[0]) // true
    // 观测数组每一项
    if (inserted) observerArray(inserted)
    return r
  }
})

// 对数组的每一项进行观察
export function observerArray(inserted) {
  for (let i in inserted) {
    observe(inserted[i])
  }
}
