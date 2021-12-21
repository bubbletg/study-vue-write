import { observe } from "./index"
import { arrayMethods, observerArray } from "./array"
import Dep from "./dep"

export function defineReactive(data, key, value) {
  // 如果value 是一个对象，需要深度监听
  observe(value)

  let dep = new Dep() // dep 收集依赖，收集的watcher
  // 定义响应式的数据变化
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend(); // 让dep 中可以保存 watcher ，也让 watcher 中存放 dep, 实现多对多的关系
      }
      return value
    },
    set(newValue) {
      if (newValue !== value) {
        observe(newValue) // 对新设置的进行观察
        value = newValue
        dep.notify()
      }
    }
  })
}
class Observer {
  constructor(data) {
    // data 是 vm._data
    // 用defineProperty 重新定义

    if (Array.isArray(data)) {
      data.__proto__ = arrayMethods 
      observerArray(data) // 观察素质的每一项
    } else {
      this.walk(data) //
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
}

export default Observer
