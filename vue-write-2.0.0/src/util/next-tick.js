let callbacks = []
let waiting = false
function flushCallbacks() {
  callbacks.forEach(cb => cb())
  callbacks = []
  waiting = false
}
export function nextTick(cb) {
  // 多次调用nextTick ,如果没有刷新的时候，先把cb 放入 callbacks 中
  // 当刷新后，更改 waiting,
  
  callbacks.push(cb)
  if (waiting) return
  waiting = true
  // 异步刷新 callbacks
  // 异步 执行顺序 promis mutationOvserver setImmediate setTimeout

  let timerFunc = () => {
    flushCallbacks()
  }

  if (Promise) {
    return Promise.resolve().then(timerFunc)
  }
  if (MutationObserver) {
    let observe = new MutationObserver(timerFunc)
    let textNode = document.createTextNode(1)
    observe.observe(textNode, { characterData: true })
    textNode.textContent = 2
    return
  }
  if (setImmediate) {
    return setImmediate(timerFunc)
  }
  setTimeout(timerFunc, 0)
}
