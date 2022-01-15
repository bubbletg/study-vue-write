export const createRoute = (record, location) => {
  let matched = []
  if (record) {
    while (record) {
      matched.unshift(record)
      record = record.parent //通过当前记录，找到所有父亲
    }
  }
  return {
    ...location,
    matched
  }
}

export default class History {
  constructor(router) {
    this.router = router

    //当前路径匹配出来的记录
    this.current = createRoute(null, {
      path: "/"
    })
  }

  transitionTo(location, complete) {
    // 获取当前路径，匹配对应的记录，当路径变化时候获取对应记录
    let current = this.router.match(location)
    // 放在重复点击，重复渲染
    // 匹配相同就不需要再次跳转
    if (
      location === this.current.path &&
      this.current.matched.location === current.matched.length
    ) {
      return
    }

    // 用最新的匹配结果，去更新试图
    this.current = current
    this.cb && this.cb(current)


    complete && complete()
  }
  
  // 保存回调函数
  listen(cb) {
    this.cb = cb
  }
}
