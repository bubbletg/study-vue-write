/**
 *  判断 data 是否为对象
 * @param {*} data
 * @returns
 */
export function isObject(data) {
  return typeof data === "object" && data != null
}

/**
 *  让 data[key] 的值为vlaue,且不可修改
 * @param {*} data
 * @param {*} key
 * @param {*} value
 */
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value: value
  })
}

/**
 *  代理，实现 vm[key]取到 vm[source][key] 的值
 *
 * @param {*} vm
 * @param {*} source
 * @param {*} key
 */
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destory"
]
// 合并策略
let strats = {}
/**
 * 生命周期的合并策略
 * @param {*} parentVal 
 * @param {*} childVal 
 * @returns 
 */
function mergeHooks(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHooks
})

/**
 *
 * @param {*} data
 * @param {*} data
 */
export function mergeOptions(parent, child) {
  const options = {}

  for (let key in parent) {
    mergeField(key)
  }

  for (let key in child) {
    // 已经合并过了，不再合并
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  /**
   * 默认的合并策略
   * @param {*} key
   */
  function mergeField(key) {
    // 存在策略，采用策略合并
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]))
    }
    if (typeof parent[key] === "object" && typeof child[key] === "object") {
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    } else if (child[key] == null) {
      // 只有 parent 存在
      options[key] = parent[key]
    } else {
      // parent 与 child 都存在
      options[key] = child[key]
    }
  }

  return options
}
