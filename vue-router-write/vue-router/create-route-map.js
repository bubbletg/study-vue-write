const addRouteRecord = (route, pathList, pathMap, parentRecord) => {
  const path = parentRecord ? `${parentRecord.path}/${route.path}` : route.path
  const record = {
    path,
    component: route.component,
    parent: parentRecord
  }
  if (!pathMap[path]) {
    pathMap[path] = record
    pathList.push(path)
  }
  if (route.children) {
    route.children.forEach(r => {
      addRouteRecord(r, pathList, pathMap, record)
    })
  }
}
export default function createRouteMap(
  routes,
  oldPathList = [],
  oldPathMap = {}
) {
  let pathList = oldPathList
  let pathMap = oldPathMap

  routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap)
  })
  return {
    pathList,
    pathMap
  }
}
