import { PatchFlags } from "@vue/shared";
import { baseParse, NodeTypes } from "./parse";

export const CREATE_VNODE = Symbol('createVnode');
export const TO_DISPLAY_STRING = Symbol('toDisplayString');
export const OPEN_BLOCK = Symbol('openBlock');
export const CREATE_BLOCK = Symbol('createBlock');
export const FRAGMENT = Symbol('Fragment');
export const CREATE_TEXT = Symbol('createTextVNode');

export const helperNameMap: any = {
  [CREATE_VNODE]: 'createVnode',
  [TO_DISPLAY_STRING]: 'toDisplayString',
  [OPEN_BLOCK]: 'openBlock',
  [CREATE_BLOCK]: 'createBlock',
  [FRAGMENT]: 'Fragment',
  [CREATE_TEXT]: 'createTextVNode',

}


function traverseNodeChildren(parent: any, context: any) {
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i];
    traverseNode(child, context)
  }
}

function traverseNode(node: any, context: any) {
  const { nodeTransforms } = context
  context.currentNode = node
  const exits = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    // 返回回调函数，让其延迟执行
    const onExit = nodeTransforms[i](node, context)
    if (onExit) {
      exits.push(onExit)
    }
  }
  switch (node.type) {
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseNodeChildren(node, context)
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
  }
  // 延迟执行
  let i = exits.length;
  context.currentNode = node

  while (i--) {
    exits[i]()
  }
}

function createRootCodegen(node: any, context: any) {
  const { helper } = context
  const children = node.children
  if (children.length == 1) {
    const child = children[0];
    const codegen = child.codegenNode;

    codegen.isBlock = true; // 只有一个儿子，那么他就是blocktree 的根节点
    helper(OPEN_BLOCK);
    helper(CREATE_BLOCK);
    node.codegenNode = codegen

  } else if (children.length > 1) {
    node.codegenNode = createVnodeCall(context, helper(FRAGMENT), undefined, children, PatchFlags.STABLE_FRAGMENT)
    node.codegenNode.isBlock = true
  }
}

export function transform(root: any, nodeTransforms: any) {
  const context = createTransformContext(root, nodeTransforms)
  traverseNode(root, context)
  createRootCodegen(root, context)
  root.helpers = [...context.helpers]
}

function createTransformContext(root: any, nodeTransforms: any) {
  const context = {
    root,
    currentNode: root,
    nodeTransforms,
    helpers: new Set(),
    helper(name: any) {
      context.helpers.add(name)
      return name
    }
  }
  return context
}



export function getBaseTransformPreset() { // 很多转化方法
  return [
    transformElement,
    transformText
  ]
};



function transformElement(node: any, context: any) {
  if (node.type != NodeTypes.ELEMENT) {
    return
  }
  return () => {
    const { tag, children } = node
    let vnodeTag = `'${tag}'`
    let vondePorps;
    let vnodeChildren;
    let vnodePatchFlag;
    let patchFlag = 0; // 标记这个标签是否动态

    if (children.length > 0) {
      if (children.length == 1) {
        const child = children[0];
        const type = child.type; // 查看是否动态节点
        const hasDymanicTextChild = type === NodeTypes.INTERPOLATION || NodeTypes.COMPOUND_EXPRESION;
        if (hasDymanicTextChild) {
          patchFlag |= PatchFlags.TEXT
        }
        vnodeChildren = child;
      } else {
        vnodeChildren = children
      }
    }

    if (patchFlag != 0) {
      vnodePatchFlag = patchFlag + ''
    }
    node.codegenNode = createVnodeCall(context, vnodeTag, vondePorps, vnodeChildren, vnodePatchFlag)
  }
}


function transformText(node: any, context: any) {
  if (node.type == NodeTypes.ROOT || NodeTypes.ELEMENT === node.type) {
    return () => {
      let hasText = false;
      let children = node.children;
      let container: any = null
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (isText(child)) { // 对文本合并
          hasText = true; // 文本合并
          for (let j = i + 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              if (!container) {
                container = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESION,
                  loc: child.loc,
                  children: [child]
                }
              }
              container.children.push(`+`, next)
              children.splice(j, 1)
              j--;
            } else {
              container = null
              break;
            }
          }
        }
      }
      // 文本添加 createText 方法
      if (!hasText || children.length === 1) {
        return
      }

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isText(child) || child.type == NodeTypes.COMPOUND_EXPRESION) {
          const callArgs = [];
          callArgs.push(child);
          if (child.type !== NodeTypes.TEXT) {
            callArgs.push(PatchFlags.TEXT + '');
          }

          children[i] = {
            type: NodeTypes.TEXT_CALL,
            content: child,
            loc: child.loc,
            codegenNode: createCallExpression( // 处理
              context.helper(CREATE_TEXT),
              callArgs
            )
          }
        }
      }
    }
  }
  return undefined
}

// 创建虚拟节点
function createVnodeCall(context: any, tag: string, props: undefined, children: any, patchFlag: any) {
  context.helper(CREATE_VNODE);
  return {
    type: NodeTypes.VNODE_CALL,
    tag,
    props,
    children,
    patchFlag
  }
}
function createCallExpression(callee: any, args: any) {
  return {
    type: NodeTypes.JS_CALL_EXPRESSION,
    callee,
    arguments: args
  }
}

function isText(node: any) {
  return node.type === NodeTypes.INTERPOLATION || node.type === NodeTypes.TEXT
}




export function baseCompile(template: string) {
  // 模版转化为 ast 语法树
  const ast = baseParse(template);
  const nodeTransforms = getBaseTransformPreset()
  // ast 转化
  transform(ast, nodeTransforms)

  return ast

}