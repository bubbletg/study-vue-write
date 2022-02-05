export interface ParserContent {
  line: number;
  column: number;
  offset: number;
  source: string;
  originalSource: string;
}
export const enum NodeTypes {
  ROOT, // 根
  ELEMENT, // 元素
  TEXT, //文本
  SIMPLE_EXPRESION = 4, // {{name}}
  INTERPOLATION = 5, // {{}}
  ATTRIBUTE = 6, // 属性
  DIRECTIVE = 7,
  COMPOUND_EXPRESION = 8, // 组合表达式
  TEXT_CALL = 12, // createTextVnode
  VNODE_CALL = 13, // vnode
  JS_CALL_EXPRESSION = 17
}


function createRoot(children: ParserContent, loc: any) {
  return {
    type: NodeTypes.ROOT,
    children,
    loc
  }
}
/**
 * 转化 ast 语法树
 */
export function baseParse(content: string) {
  const context = createParserContent(content);
  const start = getCursor(context)
  return createRoot(parseChildren(context), getSelection(context, start))
}

/**
 * 创建当前上下文
 * @param content
 * @returns
 */
function createParserContent(content: string): ParserContent {
  return {
    line: 1,
    column: 1,
    offset: 0,
    source: content,
    originalSource: content
  }
}


function parseChildren(context: ParserContent) {
  const nodes: any = []
  while (!isEnd(context)) {
    const s = context.source;
    let node
    if (s[0] == '<') { // 标签
      node = parseElement(context)
    } else if (s.startsWith('{{')) { // 表达式
      node = parseInterpolation(context)
    } else {
      node = parseText(context)
    }
    nodes.push(node)
  }
  // 删除多余空格
  nodes.forEach((node: any, index: number) => {
    if (node.type === NodeTypes.TEXT) {
      if (!/[^ \t\r\n]+/.test(node.content)) {
        nodes[index] = null
      } else {
        node.content = node.content.replace(/[ \t\r\n]+/g, ' ')
      }
    }
  })
  return nodes.filter(Boolean);
}
function advanceSpaces(context: ParserContent) {
  const match = /^[ \t\r\n]+/.exec(context.source)
  if (match) {
    advanceBy(context, match[0].length)
  }
}

function parseTag(context: ParserContent) {
  const start = getCursor(context)
  const match: any = /^<\/?([a-z][^ \t\r\n/>]*)/i.exec(context.source)
  const tag = match[1]
  advanceBy(context, match[0].length);
  advanceSpaces(context)
  const isSelfClosing = context.source.startsWith('/>');
  advanceBy(context, isSelfClosing ? 2 : 1)
  return {
    type: NodeTypes.ELEMENT,
    tag,
    isSelfClosing,
    loc: getSelection(context, start)
  }
}

// 解析标签
function parseElement(context: ParserContent) {
  let ele: any = parseTag(context)
  const children = parseChildren(context);// 处理儿子
  if (context.source.startsWith('</')) {
    parseTag(context)
  }
  ele.children = children
  ele.loc = getSelection(context, ele.loc.start)
  return ele;
}
// 解析表达式
function parseInterpolation(context: ParserContent) {
  const start = getCursor(context)
  // 结束位置
  const closeIndex = context.source.indexOf('}}', context.source.indexOf('{{'))
  advanceBy(context, 2)
  const innerStart = getCursor(context)
  const innerEnd = getCursor(context)
  const rawContentLength = closeIndex - 2;// 拿到 {{ 内容 }} 大括号中的内容，包含空格

  const preTrimContent = parseTextData(context, rawContentLength)
  const content = preTrimContent.trim()// 去掉空格
  const startOffset = preTrimContent.indexOf(content)
  if (startOffset > 0) {
    advancePositionWithMutation(innerStart, preTrimContent, startOffset)
  }

  const endOffset = content.length + startOffset
  advancePositionWithMutation(innerEnd, preTrimContent, endOffset)
  advanceBy(context, 2)
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESION,
      isStatic: false,
      loc: getSelection(context, innerStart, innerEnd),
      content
    },
    loc: getSelection(context, start)
  }
}


function parseText(context: ParserContent) {
  const endTokens = ['<', '{{']
  let endIndex = context.source.length; // 文本整个长度
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i], 1)
    if (index !== -1 && endIndex > index) {
      endIndex = index
    }
  }
  let start = getCursor(context)
  // 拿到文本数据
  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    loc: getSelection(context, start),
    content
  }
}


function parseTextData(context: ParserContent, endIndex: number) {
  const rawText = context.source.slice(0, endIndex)
  advanceBy(context, endIndex) // 删除文本
  return rawText
}


// 是否解析完毕
function isEnd(context: ParserContent) {
  const source = context.source
  if (source.startsWith('</')) {
    return true
  }
  return !(source)
}


function getCursor(context: ParserContent): ParserContent {
  let { line, column, offset } = context
  return { line, column, offset } as ParserContent
}
function getSelection(context: ParserContent, start: any, end?: any) {
  end = end || getCursor(context)
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  }
}

function advanceBy(context: ParserContent, endIndex: number) {
  let s = context.source
  // 结束位置
  advancePositionWithMutation(context, s, endIndex)


  context.source = s.slice(endIndex)
}

function advancePositionWithMutation(context: ParserContent, s: string, endIndex: number) {
  let linesCount = 0;
  let linePos = -1;
  for (let i = 0; i <= endIndex; i++) {
    // \n 的charCodeAt 为 10
    if (s.charCodeAt(i) == 10) {
      linesCount++;
      linePos = i;
    }
  }
  context.offset += endIndex;
  context.line += linesCount
  context.column = linePos == -1 ? context.column + endIndex : endIndex - linePos


}

