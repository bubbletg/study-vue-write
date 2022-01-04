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
