import { isReservedTag, isObject } from "../util/index"

export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key
  if (key) {
    delete data.key
  }
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, key, children, undefined)
  } else {
    const Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, key, children, undefined, Ctor)
  }
}

/**
 * 创建组件的虚拟节点
 * @param {*} vm
 * @param {*} tag
 * @param {*} data
 * @param {*} key
 * @param {*} children
 * @param {*} text
 */
export function createComponent(vm, tag, data, key, children, text, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    // 渲染组件时，执行
    init(vnode) {
      let child = (vnode.componentInstance = new Ctor({ _isComponent: true })) // 相当于 new Sub
      child.$mount()
    }
  }
  return vnode(
    vm,
    `vue-component-${Ctor.cid}-${tag}`,
    data,
    key,
    undefined,
    undefined,
    {
      Ctor,
      children
    }
  )
}

/**
 *  创建文本 虚拟dom
 * @param {*} text
 * @returns
 */
export function createTextNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

/**
 *  返回 虚拟dom
 * @param {*} vm
 * @param {*} tag
 * @param {*} data
 * @param {*} key
 * @param {*} children
 * @param {*} text
 * @returns
 */
function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}
