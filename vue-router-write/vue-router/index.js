import install from "./install"
import createMatcher from "./create-matcher"

class VueRouter {
  constructor(options) {
    const routes = options.routes || []

    // 创建匹配器的过程
    this.matcher  =  createMatcher(routes)
  }
  init(app) { // 这里的app 是最外层的 vue 实例
  console.log("🚀 ~ file: index.js ~ line 12 ~ VueRouter ~ init ~ app", app)
  }
}

VueRouter.install = install

export default VueRouter
