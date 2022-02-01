import { ShapeFlags } from "@vue/shared"
import { PublicInstanceProxyHandler } from "./componentPublicInstance"

/**
 * 根据虚拟dom 创建实例
 * @param vnode 虚拟dom
 */
export function createComponentInstance(vnode: any) {
  // 表示了组件的各种状态
  const instance = {
    vnode,
    type: vnode.type,
    props: {},
    attrs: {},
    slots: {},
    setupState: {},
    data:{},
    ctx: {},
    isMounted: false, // 标识组件是否挂载过
  }
  instance.ctx = { _: instance }
  return instance
}

export function setupComponent(instance: any) {
  const { props, children } = instance.vnode

  instance.props = props
  instance.children = children

  //当前组件不是一个有状态组件
  const isStateFul = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  if (isStateFul) { // 有状态
    // 调用当前实例 的 setup 方法，用 setup 方法返回值 填充 setupState 对应 的render 方法
    setupStatefulComponent(instance)
  }

}

function setupStatefulComponent(instance: any) {
  // 1. 代理 传递给 render 函数的参数
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandler as any)
  // 2. 获取组件的类型
  const Component = instance.type
  const { setup } = Component
  const setupcontext = createSetupContext(instance)
  setup(instance.props, setupcontext)
  Component.render(instance.proxy)
}

/**
 *  创建 setup 上下文
 * @param instance
 * @returns
 */
function createSetupContext(instance: any) {
  return {
    attrs: instance.attrs,
    // props: instance.props, 只有开发环境存在
    slots: instance.slots,
    emit: () => { },
    expose: () => { }
  }
}

