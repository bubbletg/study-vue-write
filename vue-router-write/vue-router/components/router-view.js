export default {
  name: "router-view",
  functional: true, // 声明函数式组件 ，函数不用 new ，没有this,没有生命周期，当data 没有数据时，可以使用函数是组件
  render(h, { parent, data }) {
    let route = parent.$route
    let depth = 0

    data.routerView = true // 标识路由属性

    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent
    }


    let record = route.matched[depth]
    if (!record) {
      return h() // 渲染一个空元素
    }
    return h(record.component, data)
  }
}
