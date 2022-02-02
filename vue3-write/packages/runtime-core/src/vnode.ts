import { isArray, isObject, isString, ShapeFlags } from "@vue/shared"

export const isVnode = (v: any) => v.__v_isVNode
/**
 * 创建虚拟节点
 * @param type 类型，用来区分是组件还是元素
 * @param props 属性
 * @param children 子
 */
export const createVNode = (type: any, props: any, children: any = null) => {

  // 给虚拟节点添加一个类型
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0

  const vnode = {
    __v_isVNode: true, // 标记是一个虚拟节点
    type,
    props,
    children,
    el: null,
    key: props && props.key,
    shapeFlag // 判断出自己类型和儿子类型
  }

  normalizeChildren(vnode, children)
  return vnode
}


function normalizeChildren(vnode: any, children: any) {
  let type = 0
  if (children == null) { }
  else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else {
    type = ShapeFlags.TEXT_CHILDREN
  }

  vnode.shapeFlag |= type
}

export const TEXT = Symbol('text')
export function normalizeVNode(child: any) {
  if (isObject(child)) return child
  // 对文本，创建文本 vnode 节点
  return createVNode(TEXT, null, String(child))
}
