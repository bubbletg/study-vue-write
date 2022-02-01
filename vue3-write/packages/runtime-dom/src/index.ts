import { createRenderer } from '@vue/runtime-core'
import { extend } from '@vue/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

// 合并 render 配置
export const rendererOptions = extend({ patchProp }, nodeOps)

export function createApp(rootComponent: any, rootProps: any = null) {
  const app: any = createRenderer(rendererOptions).createApp(rootComponent, rootProps)
  let { mount } = app
  app.mount = function (container: any) {
    // 清空容器
    container = nodeOps.querySelector(container)
    container.innerHTML = ''
    // 渲染组件挂载
    mount(container)

  }
  return app
}