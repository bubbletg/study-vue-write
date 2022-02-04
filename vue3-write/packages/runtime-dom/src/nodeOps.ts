
export const nodeOps = {
  // 创建
  createElement: (tagName: any) => document.createElement(tagName),

  // 删除
  remove: (child: any) => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },

  // 插入
  insert: (child: any, parent: any, anchor = null) => {
    parent.insertBefore(child, anchor)
  },

  nextSibling: (node: any) => {
    return node.nextSibling
  },

  // 查询
  querySelector: (selector: any) => document.querySelector(selector),

  // 文本操作
  setElementText: (el: any, text: any) => { return el.textContent = text },

  createText: (text: string) => document.createTextNode(text),
  setText: (node:any, text:string) => node.nodeValue = text
}