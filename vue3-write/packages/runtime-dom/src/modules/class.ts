
export const patchClass = (el: any, nextValue: any) => {
  if (nextValue == null) {
    nextValue = ''
  }
  el.className = nextValue
}