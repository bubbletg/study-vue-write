import Vue from "vue"
import App from "./App.vue"

import router from "./router/index"

new Vue({
  el: "#app",
  render: h => h(App),
  router
})

// 前端路由主要两种模式 一种是 hash 模式 ，# 后面跟着路径方式进行切换
// window.location.hash = '/about'
// window.onhashchange = function () {
//   // 监听 路径变化  来进行渲染对应路径的组件
// }

// 另一种方式是 window.history.pushState({},null,'/..')
// 这一种方式 在强制刷新的时候好会想后端发送请求 ，需要后端配合解决
// 使用 window.onpopstate  = function () {} // 监控浏览器路径变化

// vue-router 在hash 模式下，如果支持 onpopstate 会优先采用，低版本浏览器 会采用 onhashchange
