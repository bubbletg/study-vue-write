export function render(vnode, container) {
  let el = createElm(vnode)
  container.appendChild(el)
}

/**
 * 创建元素
 * @param {*} vnode
 * @returns
 */
function createElm(vnode) {
  let { tag, children, key, props, text } = vnode
  if (typeof tag === "string") {
    // 标签
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.map(child => {
      return render(child, vnode.el)
    })
  } else {
    // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.props // 获取当前老节点的属性
  let el = vnode.el // 当前真实节点

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}

  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ""
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      delete el[key]
    }
  }

  for (let key in newProps) {
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === "class") {
      el.className = newProps.class
    } else {
      el[key] = newProps[key]
    }
  }
}
