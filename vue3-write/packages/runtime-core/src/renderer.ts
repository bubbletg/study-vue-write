import { createAppAPI } from "./apiCreateApp"

/**
 * createRenderer 告诉 core 怎么渲染
 * @param rendererOptions 一些 dom 操作
 * @returns 返回一个 app
 */
export function createRenderer(rendererOptions: any) {
  const render = (vnode: any, container: any) => {
    // runtime-core 核心在该方法里面
  }
  return {
    createApp: createAppAPI(render)
  }
}