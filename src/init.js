import { initState } from "./state"
import { compileToFunction }  from './compiler/index'

export function initMixin(Vue) {
  /**
   *  初始化
   * @param {*} options
   */
  Vue.prototype._init = function (options) {
    const vm = this
    // vue 中使用 this.$options 指代用户传递的属性
    vm.$options = options

    // 初始化状态
    initState(vm)

    // 如果用户传入了 el 属性，将页面渲染出来
    if (vm.$options.el) {   
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)

    // 默认先查找 render, 其次 template ，最后el里面的内容
    if (!options.render) {
      let template = options.template // 拿到模版
      if (!template && el) {
        template = el.innerHTML
      }
      // 将 template 转换为 render 函数
      const render = compileToFunction(template)
      console.log("🚀 ~ file: init.js ~ line 36 ~ initMixin ~ render", render)
      
      options.render = render
    }
  }
}
