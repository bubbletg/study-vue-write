export function render(vnode, container) {
  let el = createElm(vnode)
  container.appendChild(el)
  return el
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
  let newProps = vnode.props || {} // 获取当前老节点的属性
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

/**
 * 新老 vnode 替换
 * @param {*} oldVnode
 * @param {*} newVnode
 */
export function patch(oldVnode, newVnode) {
  // 1. 先比对标签
  if (oldVnode.tag !== newVnode.tag) {
    // 替换
    oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
  }
  // 2. 比较文本
  if (!oldVnode.tag) {
    if (oldVnode.text !== newVnode.text) {
      oldVnode.el.textContent = newVnode.text
    }
  }

  // 3. 标签一样，属性不一样
  let el = (newVnode.el = oldVnode.el) // 标签一样复用
  updateProperties(newVnode, oldVnode.props)

  // 4. 比较孩子
  let oldChildren = oldVnode.children || []
  let newChildren = newVnode.children || []

  if (oldChildren.length > 0 && newChildren.length > 0) {
    // 4.1 老的有孩子，新的有
    updateChildren(el, oldChildren, newChildren)
  } else if (oldChildren.length > 0) {
    // 4.2 老的有孩子，新的没有
    el.innerHTML = ""
  } else if (newChildren.length > 0) {
    // 4.3 老的没有孩子，新的有
    for (let i = 0; i < newChildren.length; i++) {
      let child = newChildren[i]
      el.appendChild(createElm(child))
    }
  }
  return el
}

function isSameNode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

function updateChildren(parent, oldChildren, newChildren) {
  // vue 增加了很多优化策略，因为在浏览器中操作dom 最常见的是 开头活着结尾插入
  // 设计到的正序和倒序

  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndindex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndindex]

  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndindex = newChildren.length - 1
  let newEndVnode = newChildren[newEndindex]

  function makeIndexByKey(children) {
    let map = {}
    children.forEach((item, index) => {
      map[item.key] = index
    })
    return map
  }
  let map = makeIndexByKey(oldChildren)
  while (oldStartIndex <= oldEndindex && newStartIndex <= newEndindex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndindex]
    }
    // 头插 和 尾插
    else if (isSameNode(oldStartVnode, newStartVnode)) {
      // 新老节点头部相同，移动头指针
      // 也就是尾部插入
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameNode(oldEndVnode, newEndVnode)) {
      // 新老节点尾部相同，移动尾指针
      // 也就是头部插入
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndindex]
      newEndVnode = newChildren[--newEndindex]
    }
    // 下面是倒序和正序
    else if (isSameNode(oldStartVnode, newEndVnode)) {
      // 交叉比较 倒序
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndindex]
    } else if (isSameNode(oldEndVnode, newStartVnode)) {
      // 交叉比较 正序
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndindex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 乱序
      // 先拿新节点的第一项去 老节点中匹配，如果匹配不到直接讲这个新节点插入到老节点开头前面
      // 如果查找到则移动到老节点
      // 最后老节点中有剩余，则直接删除老节点中剩余的属性
      // ---------------------------------

      // 拿到新节点的索引，map 是老节点列表转换的map,对应 key-index
      let moveIndex = map[newStartVnode.key]
      // 当新节点没有在老节点中存在时
      if (moveIndex == null) {
        // 直接吧新节点插入到老节点开头
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        // 移动的节点
        let moveVnode = oldChildren[moveIndex]
        patch(moveVnode, newStartVnode)
        // 移动节点
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        //
        oldChildren[moveIndex] = undefined
      }
      // 新节点往后移
      newStartVnode = newChildren[++newStartIndex]
    }
  }

  if (newStartIndex <= newEndindex) {
    for (let i = newStartIndex; i <= newEndindex; i++) {
      // 可能往前面插入，或者后面插入

      // 新的要插入的元素
      let ele =
        newChildren[newEndindex + 1] == null
          ? null
          : newChildren[newEndindex + 1].el
      parent.insertBefore(createElm(newChildren[i]), ele)
    }
  }

  if (oldStartIndex <= oldEndindex) {
    for (let i = oldStartIndex; i <= oldEndindex; i++) {
      let child = oldChildren[i]
      if (child != null) {
        parent.removeChild(child.el)
      }
    }
  }


  // 循环时候，尽量不要使用索引作为key  可能导致重新创建当前元素的所有子元素
}
