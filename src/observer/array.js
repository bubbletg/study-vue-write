// 我们要重写数组改变本身的方法：
// push shift unshift pop revese sort splice

let oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)

const methods = ["push", "shift", "unshift", "pop", "revese", "sort", "splice"]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // AOP 切片编程
    const result = oldArrayMethods[method].apply(this, args)

    let inserted // 当前用户插入的元素
    switch (method) {
      case "push":
      case "unshift":
        inserted = args
        break
      case "splice":
        inserted = args.splice(2)
        break
    }
    
    const ob = this.__ob__
    if (inserted) {
      ob.observerArray(inserted)
    }
    // 派发更新
    ob.dep.notify()
    return result
  }
}) 
