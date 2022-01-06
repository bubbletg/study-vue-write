import { initMixin } from "./init"
import { renderMixin } from "./render"
import { lifecycleMixin } from "./lifecycle"
import { initGlobalAPI } from "./initGlobalAPI/index"
import { stateMixin } from "./state"

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

stateMixin(Vue)

// 初始化全局API
initGlobalAPI(Vue)

export default Vue
