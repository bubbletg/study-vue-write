import { createElement, createTextNode } from "./vdom/create-element"

export function renderMixin(Vue) {
  /**
   *  创建元素的虚拟节点
   * @returns
   */
  Vue.prototype._c = function () {
    return createElement(this,...arguments)
  }

  /**
   *  传教文本的虚拟节点
   * @param {*} text
   * @returns
   */
  Vue.prototype._v = function (text) {
    return createTextNode(this,text)
  }

  /**
   * JSON.stringify
   * @param {*} val
   * @returns
   */
  Vue.prototype._s = function (val) {
    return val == null ? "" : typeof val == "object" ? JSON.stringify(val) : val
  }

  /**
   * 通过解析 render 渲染出虚拟DOM
   */
  Vue.prototype._render = function () {
    const vm = this
    const { render } = vm.$options
    console.log("🚀 ~ file: render.js ~ line 36 ~ renderMixin ~ render", render)
    let vonde = render.call(vm)
    return vonde
  }
}

// ;(function anonymous() {
//   with (this) {
//     return _c(
//       "div",
//       {
//         id: "aaaa",
//         class: "abc-abc",
//         style: { background: "red", color: "blick" }
//       },
//       _v("hello,你好"),
//       _c(
//         "div",
//         { style: { background: "red", color: "blick" } },
//         _v("age:" + _s(age) + ",name:" + _s(name) + ",你好")
//       ),
//       _c("span", undefined, _v("age:" + _s(age)))
//     )
//   }
// })