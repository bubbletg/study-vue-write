import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component";

/**
 * createRenderer 告诉 core 怎么渲染
 * @param rendererOptions 一些 dom 操作
 * @returns 返回一个 app
 */
export function createRenderer(rendererOptions: any) {

  const setupRenderEffect = () => {
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
    setupRenderEffect()

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
  const procesComponent = (n1: any, n2: any, container: any) => {
    if (n1 == null) { // 组件没有上一次的虚拟节点
      mountComponent(n2, container)
    } else {
      // 组件更新流程
      updateComponent(n1, n2, container)
    }
  }

  const patch = (n1: null, n2: any, container: any) => {
    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) { // 元素
      console.log('元素')
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { // 组件
      procesComponent(n1, n2, container)
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