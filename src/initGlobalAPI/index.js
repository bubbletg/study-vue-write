
import {mergeOptions} from '../util/index'


export function initGlobalAPI(Vue) {
  // 整合了全局相关的内容
  Vue.options = {}

  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }

  // Vue.mixin({
  //   a: 1,
  //   beforeCreate() {
  //      console.log(11111)

  //   }
  // })

  //  Vue.mixin({
  //    a: 2,
  //    b: 3,
  //    beforeCreate() {
  //      console.log(222)
  //    }
  //  })
  //    Vue.mixin({
  //      c: 2,
  //      d: 3,
  //      beforeCreate() {
  //        console.log(3333)
  //      }
  //    })


}