

import { PatchFlags } from '@vue/shared';
import { baseParse, NodeTypes } from './parse'
import { helperNameMap, getBaseTransformPreset, transform, OPEN_BLOCK } from './transform';
export * from './parse'
export * from './transform'


export function baseCompile(template: string) {
  // 模版转化为 ast 语法树
  const ast = baseParse(template);
  const nodeTransforms = getBaseTransformPreset()
  // ast 转化
  transform(ast, nodeTransforms)
  return generate(ast)

}
function createCodegenContext(ast: any) {
  const newLine = (n: any) => {
    context.push('\n' + '   '.repeat(n))
  }
  const context = {
    code: ``, // 拼接结果
    push(c: any) {
      context.code += c
    },
    indextLevel: 0,
    newLine() { // 换行
      newLine(context.indextLevel)
    },
    indent() { // 缩进
      newLine(++context.indextLevel);
    },
    deindent() {
      newLine(--context.indextLevel);
    },
    helper(name: any) {
      return `${helperNameMap[name]}`
    }
  }
  return context
}

function generate(ast: any) {
  const context = createCodegenContext(ast)
  const { push, newLine, indent, deindent } = context
  push(`const _Vue = Vue`)
  newLine();
  push(`return function render(_ctx){`)
  indent()
  push(`with (_ctx) {`)
  indent()
  push(`const {${ast.helpers.map((s: any) => `${helperNameMap[s]}`).join(',')}} = _Vue`)
  newLine();
  push(`return `)
  genNode(ast.codegenNode, context);
  deindent()
  push(`}`)
  deindent()
  push(`}`)
  return context.code
}

function genNode(node: any, context: any) {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      break;
    case NodeTypes.TEXT:
      break;
    case NodeTypes.INTERPOLATION:
      break;
    case NodeTypes.SIMPLE_EXPRESION:
      break;
    case NodeTypes.COMPOUND_EXPRESION:
      break;
    case NodeTypes.TEXT_CALL:
      break;
    case NodeTypes.VNODE_CALL:
      genVNodeCall(node, context);
      break;
    case NodeTypes.JS_CALL_EXPRESSION:
      break;
  }

}

function genVNodeCall(node: any, context: any) {
  const { push, newLine, indent, deindent } = context
  const { tag, children, props, patchFlag, isBlock } = node
  if (isBlock) {
    push(`(${context.helper(OPEN_BLOCK)}()`)
  }
}

