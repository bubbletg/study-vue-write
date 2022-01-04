import { initState } from "./state"
import { compileToFunction }  from './compiler/index'
import { mountComponent } from './lifecycle'


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

  /**
   * 挂载 
   * 主要流程：1.将 template 转换成 ast 语法树-> 生成 reender  方法 -> 生成虚拟dom -> 真实的DOM
   * @param {*} el 
   */
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

      /**
     * render 函数，
     * 
      <div id="app">
      <div id="aaaa" class="abc-abc" style="background:red;color:blick;">
        hello,你好
        <div style="background:red;color:blick;">age:{{ age
        }},  name: {{ name}}     ,你好</div>
        <span>age:{{ age}}</span>
      </div>
    </div>
    ----------------------转换为下面👇render 函数-------------------
      (function anonymous(
      ) {
          with(this){return _c("div",{id:"aaaa",class:"abc-abc",style:{"background":"red","color":"blick"}},_v("hello,你好"),_c("div",{style:{"background":"red","color":"blick"}},_v("age:"+_s(age)+",name:"+_s(name)+",你好"))
        ,_c("span",undefined,_v("age:"+_s(age)))
        )
        }
      })
     */

      options.render = render
    }

    // 渲染当前组件，挂载这个组件 
    mountComponent(vm,el)
  }
}
