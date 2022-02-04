import { isArray, isObject } from "@vue/shared";
import { createVNode, isVnode } from "./vnode";


export function h(type: any, propsOrChildren: any, children: any) {

  /**
   * h 方法可能有很多种写法，对不同的写法进行处理
   * h('div',{a:1})
   * h('div',{},'helloworld' )
   * h('div',{},h('span'))
   * h('div',h('span'))
   * h('div',[h('span'),h('span')] )
   * h('div',null,h('span'),h('span'))
   * h('div',null,'a','b','c')
   */
  const l = arguments.length
  if (l == 2) { // 表示 类型+属性 或者 类型 + 孩子
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      return createVNode(type, propsOrChildren)
    } else {
      // 不是对象，就是孩子
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l == 3 && isVnode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
