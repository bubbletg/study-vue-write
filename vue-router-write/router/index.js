import Vue from "vue"

import VueRouter from "../vue-router"

import Home from "../views/home.vue"
import About from "../views/about.vue"
import AboutA from "../views/about/a.vue"
import AboutB from "../views/about/b.vue"
import AboutBC from "../views/about/c.vue"

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
      {
        path: "b",
        component: AboutB,
        children: [{ path: "c", component: AboutBC }]
      }
    ]
  }
]

// use 会调用install 方法，会注册全局组件 router-link router-view
Vue.use(VueRouter)
const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log('1111111');
    next()
  }, 2000)
})
router.beforeEach((to, from, next) => {
  setTimeout(() => {
    console.log("2222222")
    next()
  }, 3000)
})
export default router
