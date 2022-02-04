
export const patchStyle = (el: any, prev: any, next: any) => {
  const style = el.style
  if (next == null) {
    el.removeAttribute('style')
  } else {

    if (prev) {
      for (let key in prev) {
        if (next[key] == null) { // 老的有，新的没有，删除老的
          style[key] = ''
        }
      }
    }

    for (let key in next) { // 新的直接赋值 style 上
      style[key] = next[key]
    }
  }
}