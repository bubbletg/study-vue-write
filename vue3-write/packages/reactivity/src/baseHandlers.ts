import { extend, isObject } from "@vue/shared"
import { reactive, readonly } from "."

/**
 * 创建get方法
 * 拦截获取功能
 * @param isReadonly 是否只读
 * @param shallow 是否浅的，浅代理
 */
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: object, key: PropertyKey, receiver: any) {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      // 收集依赖

    }
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}

/**
 * 创建set方法
 * 拦截设置功能
 * @param isShallow 是否浅
 */
function createSet(isShallow = false) {
  return function set(target: object, key: PropertyKey, value: any, receiver: any) {
    const res = Reflect.set(target, key, value, receiver);
    return res
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true, false)
const showllowReadonlyGet = createGetter(true, true)

const set = createSet()
const shallowSet = createSet(true)

export const mutableHandlers = {
  get, set
}
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet
}
const readonlySet = {
  set: (_target: any, key: any) => {
    console.warn(`set on key ${key} falied`)
  },
}
export const readonlyHandlers = extend({
  get: readonlyGet,
}, readonlySet)

export const shallowReadonlyHandlers = extend({
  get: showllowReadonlyGet,
}, readonlySet)

