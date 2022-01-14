import { parserHTML } from "./parser/index"
import { generate } from "./parser/generate"

export function compileToFunction(template) {
  // 解析HTML，变为 AST语法树
  let root = parserHTML(template)
  // 将 ast 语法树 转换成 字符穿 render 函数模版
  let code = generate(root)
  let renderFn = new Function(`with(this){return ${code}}`)
  return renderFn
}
