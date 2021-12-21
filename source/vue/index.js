import Watcher from "./observe/watcher"
import { initState } from "./observe"
import { compiler } from "./util"

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

Vue.prototype._update = function () {
  // 用户传入的数据，去更新视图
  let vm = this
  let el = vm.$el

  let node = document.createDocumentFragment()
  let firstChild
  while ((firstChild = el.firstChild)) {
    node.appendChild(firstChild) // appendChild 具有移动的功能
  }
  compiler(node, vm)
  el.appendChild(node)
}

// 渲染页面，挂载
Vue.prototype.$mount = function () {
  let vm = this
  let el = vm.$options.el
  el = vm.$el = query(el) // 获取当前挂在的节点

  // 渲染页面 通过 watcher 来渲染的

  let updateComponent = () => {
    vm._update() // 更新组件
  }
  new Watcher(vm, updateComponent) // 渲染 Watcher

  //
}

Vue.prototype.$watch = function (expr, handler,opts) {
  let vm = this
  new Watcher(vm, expr, handler, { user: true ,...opts }) // 用户自己定义的watch
}

function query(el) {
  if (typeof el === "string") {
    return document.querySelector(el)
  }
  return el
}

export default Vue
