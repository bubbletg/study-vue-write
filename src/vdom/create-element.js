export function createElement(tag, data = {}, ...children) {
  let key = data.key
  if (key) {
    delete data.key
  }
  return vnode(tag, data, key, children, undefined)
}

/**
 *  创建文本 虚拟dom
 * @param {*} text
 * @returns
 */
export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

/**
 *  返回 虚拟dom
 * @param {*} tag
 * @param {*} data
 * @param {*} key
 * @param {*} children
 * @param {*} text
 * @returns
 */
function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
