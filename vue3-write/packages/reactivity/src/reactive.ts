import { isObject } from "@vue/shared"
import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from "./baseHandlers"

export function reactive(target: any):any {
  return createReactiveObject(target, false, mutableHandlers);
}

export function shallowReactive(target: any) {
  return createReactiveObject(target, false, shallowReactiveHandlers)
}

export function readonly(target: any) {
  return createReactiveObject(target, true, readonlyHandlers)

}

export function shallowReadonly(target: any) {
  return createReactiveObject(target, true, shallowReadonlyHandlers)

}

const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
export function createReactiveObject(target: any, isReadonly: boolean, basehandlers: any) {
  // 目标不是对象，没办法拦截，reactive 只能拦截对象类型
  if (!isObject(target)) {
    return target
  }

  // 如果被代理过，就不用再次代理了

  const proxyMap = isReadonly ? reactiveMap : readonlyMap

  // 存在已经代理，直接返回
  const existProxy = proxyMap.get(target)
  if (existProxy) {
    return existProxy
  }

  const proxy = new Proxy(target, basehandlers)
  proxyMap.set(target, proxy) // 将代理的对象和对应结果缓存起来

  return proxy
}