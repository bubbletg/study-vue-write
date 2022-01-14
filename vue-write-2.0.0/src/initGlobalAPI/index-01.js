import { mergeOptions } from "../util/index"

export function initGlobalAPI(Vue) {
  // 整合了全局相关的内容
  Vue.options = {}

  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }

  Vue.options._base = Vue // 父类
  Vue.options.components = {}
  Vue.computed = function (id, definition) {
    definition = this.options._base.extend(definition)
    this.options.components[id] = definition    
  }


  Vue.extend = function (otps) {
    const Super = this
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(Super.options, otps)
    return Sub
  }
}
