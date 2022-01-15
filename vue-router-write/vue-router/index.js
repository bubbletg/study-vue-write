import install from "./install"
import createMatcher from "./create-matcher"
import BrowserHistory from "./history/browserHistory"
import HashHistory from "./history/hashHistory"

class VueRouter {
  constructor(options) {
    const routes = options.routes || []
    // 创建匹配器的过程
    this.matcher = createMatcher(routes)

    // 创建历史管理
    this.mode = options.mode || "hash"
    switch (this.mode) {
      case "hash":
        this.history = new HashHistory(this)
        break
      case "history":
        this.history = new BrowserHistory(this)
        break
    }

    this.beforeHooks = []
  }
  init(app) {
    // 这里的app 是最外层的 vue 实例

    const history = this.history
    let setupHashListener = () => {
      history.setupListener()
    }
    // 跳转路径
    // transitionTo 跳转逻辑
    // getCurrentLocation hash 才有
    // setupHashListener hash 监听
    history.transitionTo(history.getCurrentLocation(), setupHashListener)

    history.listen(route => {
      //app._route 一更新，就会让视图更新
      app._route = route
    })
  }
  match(location) {
    return this.matcher.match(location)
  }
  push(location) {
    // const history = this.history
    window.location.hash = location
  }
  beforeEach(fn) {
    this.beforeHooks.push(fn)
  }
}

VueRouter.install = install

export default VueRouter
