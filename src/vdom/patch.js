/**
 * 创建节点，替换老的节点
 * @param {*} oldVnode
 * @param {*} vnode
 */
export function patch(oldVnode, vnode) {
  // 1. 判断是更新还是渲染
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode
    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)

    parentElm.removeChild(oldElm)
    return el
  }
}

/**
 * 根据虚拟节点创建 真实的节点
 * @param {*} vnode
 * @returns
 */
function createElm(vnode) {
  let { tag, children, key, data, text } = vnode
  if (typeof tag === "string") {
    // 标签
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    // 递归创建儿子，并添加在父节点中
    children.forEach(child => vnode.el.appendChild(createElm(child)))
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

/**
 * 更新属性
 * @param {*} vnode
 */
function updateProperties(vnode) {
  let newProps = vnode.data || {}
  let el = vnode.el
  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === "class") {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
