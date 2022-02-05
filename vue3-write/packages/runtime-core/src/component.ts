import { isFunction, isObject, ShapeFlags } from "@vue/shared"
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
    data: {},
    ctx: {},
    isMounted: false, // 标识组件是否挂载过
  }
  instance.ctx = { _: instance }
  return instance
}

/**
 * 把数据解析在实例上
 * @param instance  实例
 */
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

// 当前组件实例
export let currentInstance = null;

export const setCurrentInstance = (instance: any) => {
  currentInstance = instance
}

export const getCurrentInstace = () => { // 在执行 setup 方法中获取当前实例
  return currentInstance
}

// 调用当前实例的 setup方法
function setupStatefulComponent(instance: any) {
  // 1. 代理 传递给 render 函数的参数
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandler as any)
  // 2. 获取组件的类型
  const Component = instance.type
  const { setup } = Component
  if (setup) {
    // 当前组件实例在setup 执行完后就没了
    currentInstance = instance
    const setupcontext = createSetupContext(instance)
    const setupResult = setup(instance.props, setupcontext)

    currentInstance = null
    // 处理返回值
    handleSetupResult(instance, setupResult)
  } else {
    finishComponentSetup(instance);
  }
}

/**
 * 处理 setup 执行返回值
 * @param setupResult
 */
function handleSetupResult(instance: any, setupResult: any) {
  if (isFunction(setupResult)) {
    instance.render = setupResult
  } else if (isObject(setupResult)) {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}



/**
 * 完成组件启动
 * @param instance
 */
function finishComponentSetup(instance: any) {

  const Component = instance.type
  if (!instance.render) {
    // 没有 render 函数
    // 对 template 模版编译，产生 render 函数
    if (Component.render && Component.template) {
      // 模版编译
    }
    instance.render = Component.render
  }
  // 对 vue2.0 兼容，主要是 合并
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


