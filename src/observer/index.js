import { isObject, def } from "../util/index"
import { arrayMethods } from "./array.js"
class Observer {
  constructor(value) {
    // 用于在 array.js 用可以拿到 Observer 的 observerArray 方法
    def(value, "__ob__", this)
    
    if (Array.isArray(value)) {
      // 观测数组，不会对数组的索引进行观测，会导致性能问题

      // 对数组操作的方法进行劫持,函数劫持
      value.__proto__ = arrayMethods
      // 数组里放的是对象进行观测
      this.observerArray(value)
    } else {
      // 对对象进行观测
      this.walk(value)
    }
  }

  /**
   * 实现数组的每一项劫持
   * @param {*} value
   */
  observerArray(value) {
    for (let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }

  /**
   * 实现对对象的观测
   * @param {*} data
   */
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[key]
      // 定义响应式数据
      defineReactive(data, key, value)
    }
  }
}

function defineReactive(data, key, value) {
  // 递归劫持对象，实现深度劫持
  observe(value)
  Object.defineProperty(data, key, {
    set(newValue) {
      if (newValue == value) return
      // 对用户设置的数据进行劫持
      observe(newValue)
      value = newValue
    },
    get() {
      return value
    }
  })
}

export function observe(data) {
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}
