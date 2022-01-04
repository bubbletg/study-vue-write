// 在 Vue 源码 目录下 src/compiler/parser/html-parser.js

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
export const unicodeLetters =
  "a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD"

const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeLetters}]*` // aa-aaa
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 匹配类似 <aa:aaa>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配标签开头
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/

const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

let root = null // ast 语法树
let currentParent // 标识当前 父亲是谁
let stack = [] // 标签栈
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    attrs: attrs,
    parent: null,
    children: []
  }
}

/**
 * 开始标签 处理
 * @param {*} tagName
 * @param {*} attrs
 */
function start(tagName, attrs) {
  // 遇到开始标签，创建一个 ast 元素
  let element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  currentParent = element // 标记当前标签
  stack.push(element)
}

/**
 * 文本标签处理
 * @param {*} text
 */
function chars(text) {
  text = text.replace(/\s/g, "")
  if (text) {
    currentParent.children.push({
      text,
      type: TEXT_TYPE,
    })
  }
}

/**
 * 结尾标签处理
 * @param {*} tagName 
 */
function end(tagName) {
  let element = stack.pop()
  if (tagName === element.tag) {
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
}

export function parserHTML(html) {
  html = html.trim()
  while (html) {
    let textEnd = html.indexOf("<")
    if (textEnd === 0) {
      // 索引为0 肯定是一个标签
      // 拿到 tagName, attrs
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      // 标签结尾
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    // 文本
    let text
    if (textEnd >= 0) {
      // 拿到 文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }

  /**
   * 删除 html 的前面 n 个字符
   * @param {*} n
   */
  function advance(n) {
    html = html.substring(n)
  }

  /**
   * 拿到 标签的 taName,attrs
   * @returns
   */
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length) // 去掉标签开始

      let end, attrs
      // 循环匹配 到 标签属性
      while (
        !(end = html.match(startTagClose)) &&
        (attrs = html.match(attribute))
      ) {
        advance(attrs[0].length) // 去掉属性
        match.attrs.push({
          name: attrs[1],
          value: attrs[3] || attrs[4] || attrs[5]
        }) // 添加属性
      }
      // >
      if (end) {
        advance(end[0].length)
      }
      return match
    }
  }

  return root
}
