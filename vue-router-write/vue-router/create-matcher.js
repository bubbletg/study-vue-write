import createRouteMap from "./create-route-map"

export default function createMatcher(routes) {
  // pathList 会把所有的路由 组成一个数组 ['/','/about','/about/a','/about/b','/xxx]
  // pathMap  {/:{},/about:{},/about/a:{}}
  let { pathList, pathMap } = createRouteMap(routes)
  console.log("🚀 ~ file: create-matcher.js ~ line 7 ~ createMatcher ~ pathList", pathList,pathMap)
  
  function match() {}
  function addRoutes(routes) {
    createRouteMap(routes, pathList, pathMap)
  }
  return {
    match,
    addRoutes
  }
}
