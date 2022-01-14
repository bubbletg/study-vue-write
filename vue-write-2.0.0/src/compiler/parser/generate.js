
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配 {{ }}



/**
 * 把属性转换为字符串
 * @param {*} attrs
 * @returns
 */
function genProps(attrs) {
  let str = ""
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === "style") {
      // style="color:red;fontSize:14px;" => {style:{color:'red'}}
      let obj = {}
      attr.value.split(";").forEach(item => {
        let [key, value] = item.split(":")
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}


/**
 * 处理子元素模版
 * @param {*} el
 * @returns
 */
function genChildren(el) {
  let children = el.children
  if (children && children.length > 0) {
    return `${children.map(c => gen(c)).join(",")}`
  } else {
    return false
  }
}

/**
 * 处理内容
 * @param {*} node
 */
function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    let text = node.text

    let tokens = []
    let match, index
    let lastIndex = (defaultTagRE.lastIndex = 0)
    while ((match = defaultTagRE.exec(text))) {
      index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join("+")})`
  }
}

/**
 * 生成一个字符串模版
 * @param {*} el
 * @returns
 */
export function generate(el) {
  let children = genChildren(el)

  let code = `_c("${el.tag}",${
    el.attrs.length > 0 ? genProps(el.attrs) : "undefined"
  }${children ? `,${children}` : ""})
  `
  return code
}
