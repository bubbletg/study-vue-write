export function vnode(tag, props, key, children, text) {
  return {
    tag, // 当前标签名
    props, //标签上的属性
    key,
    children,
    text
  }
}
