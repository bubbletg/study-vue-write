import Vue from "vue"

import VueRouter from "../vue-router"

import Home from "../views/home.vue"
import About from "../views/about.vue"
import AboutA from "../views/about/a.vue"
import AboutB from "../views/about/b.vue"

let routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/about",
    component: About,
    children: [
      {
        path: "a",
        component: AboutA
      },
      { path: "b", component: AboutB }
    ]
  }
]

// use 会调用install 方法，会注册全局组件 router-link router-view
Vue.use(VueRouter)
export default new VueRouter({
  routes
})
