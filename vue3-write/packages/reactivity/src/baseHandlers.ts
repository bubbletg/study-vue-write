import { extend, hasChanged, hasOwn, isArray, isIntergerKey, isObject } from "@vue/shared"
import { reactive, readonly } from "."
import { track, trigger } from "./effect"
import { TrackOpTypes, TriggerOrType } from "./operators"


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

/**
 * 创建get方法
 * 拦截获取功能
 * @param isReadonly 是否只读
 * @param shallow 是否浅的，浅代理
 */
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: any, key: any, receiver: any): any {
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      // 收集依赖
      track(target, TrackOpTypes.GET, key);
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
  return function set(target: any, key: any, value: any, receiver: any): any {
    const oldValue = target[key];
    // 判断 target 的 key 是新添加的 key, 还是原来存在
    let hasKey = (isArray(target) && isIntergerKey(key) ?
      Number(key) < target.length
      : hasOwn(target, key))

    const res = Reflect.set(target, key, value, receiver);

    if (!hasKey) {
      // 新增
      trigger(target, TriggerOrType.ADD, key, value);
    } else if (hasChanged(oldValue, value)) {
      // 修改
      trigger(target, TriggerOrType.SET, key, value, oldValue);
    }

    //派发更新
    return res
  }
}



