const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export const util = {
  getValue(vm, expr) {
    let keys = expr.trim().split(".")
    return keys.reduce((memo, current) => {
      memo = memo[current]
      return memo
    }, vm)
  },
  compilerText(node, vm) {
    // 编译文本 替换 {{}}

    if (!node.expr) {
      node.expr = node.textContent
    }
    node.textContent = node.expr.replace(defaultRE, function (...args) {
      return util.getValue(vm, args[1])
    })
  }
}

export function compiler(node, vm) {
  let childNodes = node.childNodes
  ;[...childNodes].forEach(child => {
    // nodeType 1 元素 3 文本
    if (child.nodeType === 1) {
      compiler(child, vm)
    } else if (child.nodeType === 3) {
      util.compilerText(child, vm)
    }
  })
}

