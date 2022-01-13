/**
 * 创建节点，替换老的节点
 * @param {*} oldVnode
 * @param {*} vnode
 */
export function patch(oldVnode, vnode) {
  // oldVnode 不存在，是组件
  if (!oldVnode) {
    return createElm(vnode) //没有 el 元素 ，那就是 直接根据虚拟节点返回真实节点
  }

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
 * 根据组件虚拟dom 创建 真是节点
 * @param {*} vnode
 */
function createComponent(vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    // vnode.data.hook.init
    i(vnode) // 调用 init 方法
  }
  // 组件 真实dom 创建完成，准在 vnode.componentInstance
  if (vnode.componentInstance) {
    return true // 说明组件 new 完成
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
    // 标签 或者组件

    // 创建组件
    if (createComponent(vnode)) {
      // 返回组件的真实节点
      return vnode.componentInstance.$el
    }

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
