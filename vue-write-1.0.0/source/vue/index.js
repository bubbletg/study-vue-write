import Watcher from "./observe/watcher"
import { initState } from "./observe"
import { compiler } from "./util"
import { render, patch, h } from "./vdom"

function Vue(options) {
  this._init(options) // 初始化 vue
}

Vue.prototype._init = function (options) {
  // vue 初始化 this.$options 表示的是vue 中参数
  let vm = this
  vm.$options = options

  // MVVM原理 需要数据重新初始化
  initState(vm)

  // 初始化工作
  if (vm.$options.el) {
    vm.$mount()
  }
}

Vue.prototype._render = function () {
  debugger
  let vm = this
  let render = vm.$options.render
  let vnode = render.call(vm, h)
  return vnode
}
Vue.prototype._update = function (vnode) {
  // 用户传入的数据，去更新视图
  let vm = this
  let el = vm.$el

  let preVnode = vm.preVnode // 保存上一次Vnode

  if (!preVnode) {
    // 初次渲染
    vm.preVnode = vnode
    vm.$el = render(vnode, el)
  } else {
    vm.$el = patch(preVnode, vnode)
  }

  // let node = document.createDocumentFragment()
  // let firstChild
  // while ((firstChild = el.firstChild)) {
  //   node.appendChild(firstChild) // appendChild 具有移动的功能
  // }
  // compiler(node, vm)
  // el.appendChild(node)
}

// 渲染页面，挂载
Vue.prototype.$mount = function () {
  let vm = this
  let el = vm.$options.el
  el = vm.$el = query(el) // 获取当前挂在的节点

  // 渲染页面 通过 watcher 来渲染的

  let updateComponent = () => {
    vm._update(vm._render()) // 更新组件
  }
  new Watcher(vm, updateComponent) // 渲染 Watcher

  //
}

Vue.prototype.$watch = function (expr, handler, opts) {
  let vm = this
  new Watcher(vm, expr, handler, { user: true, ...opts }) // 用户自己定义的watch
}

function query(el) {
  if (typeof el === "string") {
    return document.querySelector(el)
  }
  return el
}

export default Vue
