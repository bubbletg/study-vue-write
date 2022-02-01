
export function createAppAPI(render: Function) {
  /**
     * 告诉那个组件，那个属性来创建内容
     * @param rootComponent 根组件
     * @param rootProps 根props
     */
  return function createApp(rootComponent: any, rootProps: any) {
    const app = {
      mount(container: any) { // 挂载目的地
        console.log("🚀 ~ file: index.ts ~ line 23 ~ mount ~ container", container, rootComponent, rootProps)
        // 1. 根据组件创建虚拟节点
        // 2. 将虚拟节点和容器通过render进行渲染
        let vnode = {}
        render(vnode, container)
      }
    }
    return app
  }
}