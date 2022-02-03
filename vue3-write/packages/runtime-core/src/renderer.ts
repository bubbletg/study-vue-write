import { effect } from "@vue/reactivity";
import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component";
import { queueJob } from "./scheduler";
import { normalizeVNode, TEXT } from "./vnode";

/**
 * createRenderer 告诉 core 怎么渲染
 * @param rendererOptions 一些 dom 操作
 * @returns 返回一个 app
 */
export function createRenderer(options: any) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
  } = options

  /**
   * 创建一个 effect 让 render 执行
   * @param instance
   */
  const setupRenderEffect = (instance: any, container: any) => {
    // 让每一个组件都有一个 effect,vue3 是组件级更新，数据变化会执行对应组件变化
    instance.update = effect(function componentEffect() {
      // 没有挂载，首次渲染
      if (!instance.isMounted) {
        const proxyToUse = instance.proxy
        const subTree = instance.subTree = instance.render.call(proxyToUse, proxyToUse)

        patch(null, subTree, container)
        // 初次渲染
        instance.isMounted = true
      } else {
        // 更新逻辑
        console.log('更新逻辑');
      }
    }, {
      // 组件更新时候先走这里， scheduler 这里逻辑
      scheduler: (effect: any) => {
      // 在执行 effect
        return queueJob(effect)
      }
    });
  }

  /**
   *挂载组件，组件的渲染流程都在这里
   * @param initialVnode
   * @param container
   */
  const mountComponent = (initialVnode: any, container: any) => {
    /*
    渲染流程
    1. 先有实例
    2. 把数据解析在实例上
    3. 创建一个 effect 让 render 执行
    */

    // 1. 先有实例
    const instance = (initialVnode.component = createComponentInstance(initialVnode))
    // 2. 把数据解析在实例上
    setupComponent(instance)
    // 3. 创建一个 effect 让 render 执行
    setupRenderEffect(instance, container)

  }
  /**
   * 更新组件
   * @param oldVnode
   * @param newVnode
   * @param container
   */
  const updateComponent = (oldVnode: any, newVnode: any, container: any) => {
    console.log(`updateComponent`);

  }

  /**
   * 组件操作
   * @param n1
   * @param n2
   * @param container
   */
  const processComponent = (n1: any, n2: any, container: any) => {
    if (n1 == null) { // 组件没有上一次的虚拟节点
      mountComponent(n2, container)
    } else {
      // 组件更新流程
      updateComponent(n1, n2, container)
    }
  }

  const mountChildren = (children: any, container: any) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalizeVNode(children[i])
      patch(null, child, container)
    }
  }
  const mountElement = (vnode: any, container: any) => {
    // 递归渲染
    const { props, shapeFlag, type, children } = vnode
    // 创建元素
    let el = (vnode.el = hostCreateElement(type))
    if (props) {
      for (const key in props) {
        // 处理 prop
        hostPatchProp(el, key, null, props[key])
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 插入文本,文本，直接插入
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 是一个数组
      mountChildren(children, el)
    }
    // 插入元素
    hostInsert(el, container)
  }
  const updateElement = () => {

  }
  /**
   * 处理元素
   * @param n1
   * @param n2
   * @param container
   */
  const processElement = (n1: any, n2: any, container: any) => {
    if (n1 == null) { // 组件没有上一次的虚拟节点
      mountElement(n2, container)
    } else {
      // 组件更新流程
      // updateElement(n1, n2, container)
    }
  }

  // 处理文本
  const processText = (n1: any, n2: any, container: any) => {
    if (n1 == null) {
      // 插入文本
      hostInsert((n2.el = hostCreateText(n2.children)), container)
    } else {
    }
  }

  const patch = (n1: null, n2: any, container: any) => {
    const { shapeFlag, type } = n2;
    switch (type) {
      case TEXT:
        // 处理文本
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) { // 元素
          processElement(n1, n2, container)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { // 组件
          processComponent(n1, n2, container)
        }
        break
    }
  }
  const render = (vnode: any, container: any) => {
    // runtime-core 核心在该方法里面
    patch(null, vnode, container)
  }
  return {
    createApp: createAppAPI(render)
  }
}