import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  /**
   * 通过 虚拟DOM 创建真实的DOM
   * @param {*} vnode  虚拟DOM
   */
  Vue.prototype._update = function (vnode) {
    const vm = this
    // patch 用虚拟节点创建真实的节点，替换真实的$el
    vm.$el = patch(vm.$el, vnode)
  }
}

/**
 * 挂载 Component
 * @param {*} vm
 * @param {*} el
 */
export function mountComponent(vm, el) {
  const options = vm.$options
  vm.$el = el

  // 渲染页面
  // 该方法无论是渲染还是更新都会调用此方法
  let updateComponent = () => {
    // vm._render() 返回的虚拟DOM
    vm._update(vm._render())
  }

  // 渲染 watcher , 每一个组件都有一个watcher
  new Watcher(vm, updateComponent, () => {}, true) // true 标识这是一个渲染Watcher
}
