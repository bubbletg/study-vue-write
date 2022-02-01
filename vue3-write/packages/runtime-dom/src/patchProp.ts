
import { patchEvent } from "./modules/events"
import { patchAttr } from "./modules/attr"
import { patchStyle } from "./modules/style"
import { patchClass } from "./modules/class"



export const patchProp = (el: any, key: any, prevValue: any, nextValue: any) => {
  switch (key) {
    case "class":
      patchClass(el, nextValue)
      break
    case "style":
      patchStyle(el, prevValue, nextValue)
      break
    default:
      if (/^on[^a-z]/.test(key)) {
        // 事件
        patchEvent(el, key, nextValue)
      } else {
        // 属性
        patchAttr(el, key, nextValue)
      }
      break
  }

}