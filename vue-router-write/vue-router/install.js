
import RouterLink from './components/router-link'
import RouterView from './components/router-view'

let Vue = null

const install = function (_Vue) {
  Vue = _Vue
  Vue.component("router-link", RouterLink)
  Vue.component("router-view", RouterView)


  // 将 用户写的 router 注册到 new Vue
  // 希望 每个 子组件都可以得到 router 属性
  Vue.mixin({
    beforeCreate() {
      // this.$options.router 是在根实例上
      if (this.$options.router) {
        this._routerRoot = this
        this._router = this.$options.router

        this._router.init(this)
      } else {
        // 子实例，拿到父实例
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    }
  })
}

export default install