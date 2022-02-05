import { createVNode } from "./vnode"

export function createAppAPI(render: Function) {
  /**
     * 告诉那个组件，那个属性来创建内容
     * @param rootComponent 根组件
     * @param rootProps 根props
     */
  return function createApp(rootComponent: any, rootProps: any) {
    const app = {
      _props: rootProps,
      _component: rootComponent,
      _container: null,
      mount(container: any) { // 挂载目的地
        // 1. 根据组件创建虚拟节点
        const vnode = createVNode(rootComponent, rootProps)
        // 2. 将虚拟节点和容器通过render进行渲染
        render(vnode, container)
        app._container = container
        return
      }
    }
    return app
  }
}
