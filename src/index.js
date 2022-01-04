import { initMixin } from "./init"
import { renderMixin } from "./render"
import {lifecycleMixin } from "./lifecycle"


function Vue(options) {
  // 数据初始化
  this._init(options)
}

/**
 * 主要功能就是给 Vue 原型上添加 _init 方法
 */
initMixin(Vue)

renderMixin(Vue)

lifecycleMixin(Vue)

export default Vue
