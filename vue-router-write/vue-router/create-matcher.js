import createRouteMap from "./create-route-map"
import { createRoute } from "./history/base"

export default function createMatcher(routes) {
  // pathList 会把所有的路由 组成一个数组 ['/','/about','/about/a','/about/b','/xxx]
  // pathMap  {/:{},/about:{},/about/a:{}}
  let { pathList, pathMap } = createRouteMap(routes)

  function match(location) {
    let record = pathMap[location] // 获得对应的记录

    return createRoute(record, {
      path: location
    })
  }

  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap)
  }
  return {
    match,
    addRoutes
  }
}
