import { isObject, def } from "../util/index"
import { arrayMethods } from "./array.js"
import Dep from "./dep"
class Observer {
  constructor(value) {
    this.dep = new Dep() // 给数组使用

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
  let dep = new Dep() // 该 dep 只给对象使用
  // 递归劫持对象，实现深度劫持
  // 这里的 value 可能是对象，也可能是数组，返回的结果是 Observer 实例，也就是当前对应value的observer
  let childOb = observe(value)
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    set(newValue) {
      if (newValue == value) return
      // 对用户设置的数据进行劫持
      observe(newValue)
      value = newValue

      dep.notify() // 通知依赖watcher更新
    },
    get() {
      // 取值的时候，对每个属性都对应着自己的watchder
      if (Dep.target) {
        // 当前属性有watcher
        dep.depend() // 将 watcher 存起来
        if (childOb) {
          // 收集数组的相关依赖
          childOb.dep.depend()

          if (Array.isArray(value)) {
            // 当数组中还是数组时候
            dependArray(value)
          }
        }
      }
      return value
    }
  })
}

/**
 * 数组中的数组依赖收集
 * @param {*} value
 */
function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i]
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current) // 递归收集
    }
  }
}

/**
 *  通过创建 Observer 实现对数据的观测
 * @param {*} data  要观测的数据
 * @returns
 */
export function observe(data) {
  if (!isObject(data)) {
    return
  }
  return new Observer(data)
}
