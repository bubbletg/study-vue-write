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
    this.current = this.router.match(location)

    complete && complete()
  }
}
