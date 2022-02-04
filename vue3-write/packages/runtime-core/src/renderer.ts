import { effect } from "@vue/reactivity";
import { ShapeFlags } from "@vue/shared";
import { createAppAPI } from "./apiCreateApp"
import { createComponentInstance, setupComponent } from "./component";
import { queueJob } from "./scheduler";
import { normalizeVNode, TEXT } from "./vnode";

/**
 * createRenderer 告诉 core 怎么渲染
 * @param rendererOptions 一些 dom 操作
 * @returns 返回一个 app
 */
export function createRenderer(options: any) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    nextSibling: hostNextSibling,
    setText: hostSetText,
    setElementText: hostSetElementText,
  } = options

  /**
   * 创建一个 effect 让 render 执行
   * @param instance
   */
  const setupRenderEffect = (instance: any, container: any) => {
    // 让每一个组件都有一个 effect,vue3 是组件级更新，数据变化会执行对应组件变化
    instance.update = effect(function componentEffect() {
      const proxyToUse = instance.proxy
      // 没有挂载，首次渲染
      if (!instance.isMounted) {
        const subTree = instance.subTree = instance.render.call(proxyToUse, proxyToUse)

        patch(null, subTree, container)
        // 初次渲染
        instance.isMounted = true
      } else {
        // 更新逻辑
        const prevTree = instance.subTree
        const nextTree = instance.render.call(proxyToUse, proxyToUse)
        patch(prevTree, nextTree, container)
      }
    }, {
      // 组件更新时候先走这里， scheduler 这里逻辑
      scheduler: (effect: any) => {
        // 在执行 effect
        return queueJob(effect)
      }
    });
  }

  /**
   *挂载组件，组件的渲染流程都在这里
   * @param initialVnode
   * @param container
   */
  const mountComponent = (initialVnode: any, container: any) => {
    /*
    渲染流程
    1. 先有实例
    2. 把数据解析在实例上
    3. 创建一个 effect 让 render 执行
    */

    // 1. 先有实例
    const instance = (initialVnode.component = createComponentInstance(initialVnode))
    // 2. 把数据解析在实例上
    setupComponent(instance)
    // 3. 创建一个 effect 让 render 执行
    setupRenderEffect(instance, container)

  }
  /**
   * 更新组件
   * @param oldVnode
   * @param newVnode
   * @param container
   */
  const updateComponent = (oldVnode: any, newVnode: any, container: any) => {
    console.log(`updateComponent`);

  }

  /**
   * 组件操作
   * @param n1
   * @param n2
   * @param container
   */
  const processComponent = (n1: any, n2: any, container: any, anchor: any) => {
    if (n1 == null) { // 组件没有上一次的虚拟节点
      mountComponent(n2, container)
    } else {
      // 组件更新流程
      updateComponent(n1, n2, container)
    }
  }

  // 挂载孩子
  const mountChildren = (children: any, container: any) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalizeVNode(children[i])
      patch(null, child, container)
    }
  }
  // 挂载元素
  const mountElement = (vnode: any, container: any, anchor: any = null) => {
    // 递归渲染
    const { props, shapeFlag, type, children } = vnode
    // 创建元素
    let el = (vnode.el = hostCreateElement(type))
    if (props) {
      for (const key in props) {
        // 处理 prop
        hostPatchProp(el, key, null, props[key])
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 插入文本,文本，直接插入
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 是一个数组
      mountChildren(children, el)
    }
    // 插入元素
    hostInsert(el, container, anchor)
  }

  /**
   * 比对元素属性
   * @param oldProps 老属性
   * @param newProps 新属性
   */
  const patchProps = (oldProps: any, newProps: any, el: any) => {
    if (oldProps != newProps) {
      for (let key in newProps) {
        const prev = oldProps[key];
        const next = newProps[key];
        if (prev != next) {
          // 更新属性
          hostPatchProp(el, key, prev, next)
        }
      }

      // 老的里有属性，新的里没有
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  /**
   * 比对孩子
   * @param n1 老
   * @param n2 新
   * @param container 元素
   */
  const patchChildren = (n1: any, n2: any, container: any) => {
    const oldChildren = n1.children
    const newChildren = n2.children

    // 存在的情况有 老有儿子，新没有，新有老没有，新老都有，新老都是文本

    const prevShapeFlag = n1.shapeFlag
    const nextShapeFlag = n2.shapeFlag

    // 新的是文本
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 老的是有 n 个孩子，但是新的是文本
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 删除所有孩子
        unmountChildren(n1)
      }
      // 新老不一样，直接替换
      if (newChildren !== oldChildren) {
        hostSetElementText(container, newChildren)
      }
    } else {
      //上一次是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 新的是数组
        if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 两个是数组，diff 比对
          // diff 算法比对
          patchKeyedChildren(oldChildren, newChildren, container)
        } else {
          // 没有孩子,删除老的孩子
          unmountChildren(oldChildren)
        }
      } else {
        // 上一次是文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 清空上一次文本
          hostSetElementText(container, '')
        }
        // 新的是数组
        if (nextShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 挂载新的
          mountChildren(newChildren, container)
        }
      }
    }
  }

  // diff 算法来更新子元素
  const patchKeyedChildren = (oldChildren: any, newChildren: any, container: any) => {
    let i = 0;
    let oldRIndex = oldChildren.length - 1;
    let newRIndex = newChildren.length - 1;

    // 从头向后开始比，遇到不同的就停止
    while (i <= oldRIndex && i <= newRIndex) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i]
      if (isSameVnodeType(oldChild, newChild)) {
        patch(oldChild, newChild, container)
      } else {
        // 不相同，跳出
        break;
      }
      i++;
    }
    // 从后向前
    while (i <= oldRIndex && i <= newRIndex) {
      const oldChild = oldChildren[oldRIndex];
      const newChild = newChildren[newRIndex];
      if (isSameVnodeType(oldChild, newChild)) {
        patch(oldChild, newChild, container)
      } else {
        // 不相同，跳出
        break;
      }
      oldRIndex--;
      newRIndex--;
    }

    // 一方比对完成
    // 如果 i 大于 oldRIndex,说明老的少，新的多
    if (i > oldRIndex) {
      // 有新增加的部分
      if (i <= newRIndex) {

        // 拿到参照物
        const nextPos = newRIndex + 1;
        //  nextPos < newChildren.length 为 true 向前插入，false 向后插入
        const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null;

        // 循环插入新增加的
        while (i <= newRIndex) {
          patch(null, newChildren[i++], container, anchor)
        }
      }
    } else if (i >= newRIndex) { // 如果 i 小于 newRIndex,说明老的多，新的少
      while (i <= oldRIndex) {
        // 删除所有老的
        unmount(oldChildren[i++])
      }
    } else {
      // 乱序比较
      // 尽可能复用，用新的元素做成一个映射表，去老的子元素中找，一样就父用，不一样就插入或者删除。
      let s1 = i;
      let s2 = i;

      // vue3 用新的做映射表，vue2 用老的做映射表

      const keyToNewIndexMap = new Map();
      for (let j = s2; j <= newRIndex; j++) {
        const newChild = newChildren[j];
        keyToNewIndexMap.set(newChild.key, j);
      }

      // 需要patch 的数量
      const toBePatched = newRIndex - s2 + 1;
      // 维护 pact 过的节点
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0)

      // 拿老的去 映射表里面找，看是存在复用
      for (let k = s1; k <= oldRIndex; k++) {
        const oldChild = oldChildren[k];
        const newIndex = keyToNewIndexMap.get(oldChild.key)
        if (newIndex == null) {
          // 老节点不在新的中，删除老的
          unmount(oldChild)
        } else {
          // 新的和旧的索引 关系,pacth 过的 维护下标
          newIndexToOldIndexMap[newIndex - s2] = k + 1
          // 新老的比对
          patch(oldChild, newChildren[newIndex], container)
        }
      }

      // 最长递增子序列
      let increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);

      let j = increasingNewIndexSequence.length - 1;
      for (let i = toBePatched - 1; i >= 0; i--) {
        let currentIndex = i + s2; // 找到要插入的索引
        let child = newChildren[currentIndex] // 节点
        // let newNextchildEl = newChildren[currentIndex + 1].el // 到下一个节点
        const anchor = currentIndex + 1 < newChildren.length ? newChildren[currentIndex + 1].el : null
        if (newIndexToOldIndexMap[i] == 0) {
          //  为 0 ，说明没有被patch
          patch(null, child, container, anchor)
        } else {
          if (i != increasingNewIndexSequence[j]) {
            hostInsert(child.el, container, anchor) // 插入
          } else {
            j--;
          }
        }
      }
    }
  }

  /**
   * 卸载所有孩子
   * @param children 孩子
   */
  const unmountChildren = (children: any) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i])
    }
  }


  /**
   * pact 元素
   * @param n1 老虚拟节点
   * @param n2 新虚拟节点
   * @param container 元素
   * @param anchor
   */
  const patchElement = (n1: any, n2: any, container: any, anchor: any) => {

    // 元素相同的节点,复用节点
    let el = (n2.el = n1.el)

    // 下面👇更新属性，更新儿子

    // 获得新老属性
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    // 比对属性属性
    patchProps(oldProps, newProps, el)
    // 比对儿子
    patchChildren(n1, n2, el)
  }
  /**
   * 处理元素
   * @param n1
   * @param n2
   * @param container
   */
  const processElement = (n1: any, n2: any, container: any, anchor: any) => {
    if (n1 == null) { // 组件没有上一次的虚拟节点
      mountElement(n2, container, anchor)
    } else {
      // 组件更新流程
      patchElement(n1, n2, container, anchor)
    }
  }

  // 处理文本
  const processText = (n1: any, n2: any, container: any) => {
    if (n1 == null) {
      // 插入文本
      hostInsert((n2.el = hostCreateText(n2.children)), container)
    } else {
    }
  }

  /**
   * 比较两个节点是否相同
   * @param n1
   * @param n2
   * @returns
   */
  const isSameVnodeType = (n1: any, n2: any) => {
    return n1.type === n2.type && n1.key === n2.key
  }

  /**
   * 卸载元素，组件
   * @param n1
   */
  const unmount = (n1: any) => {
    hostRemove(n1.el)
  }


  const patch = (n1: any, n2: any, container: any, anchor: any = null) => {
    const { shapeFlag, type } = n2;

    // 节点不同
    if (n1 && !isSameVnodeType(n1, n2)) {
      // 下一个节点
      const anchor = hostNextSibling(n1.el)
      // 把以前的删掉，换成n2
      unmount(n1);
      n1 = null;
      patch(n1,n2, container,anchor)
    }


    switch (type) {
      case TEXT:
        // 处理文本
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) { // 元素
          processElement(n1, n2, container, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { // 组件
          processComponent(n1, n2, container, anchor)
        }
        break
    }
  }
  const render = (vnode: any, container: any) => {
    // runtime-core 核心在该方法里面
    patch(null, vnode, container)
  }
  return {
    createApp: createAppAPI(render)
  }
}


// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
