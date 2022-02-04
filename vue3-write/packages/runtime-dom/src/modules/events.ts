export const patchEvent = (el: any, key: any, value: any) => {
  // 对函数缓存
  const invokers = el._vei || (el._vei = {})
  const exists = invokers[key]

  if (value && exists) { // 当前事件绑定过，且修改事件
    exists.value = value
  } else {
    const eventName = key.slice(2).toLowerCase()
    if (value) { // 绑定事件，以前没有绑定过
      const invoker = invokers[key] = createInvoker(value)
      el.addEventListener(eventName, invoker)
    } else { // 以前绑定，没有value
      el.removeEventListener(eventName, exists)
      invokers[key] = null
    }
  }
}

function createInvoker(value: any): any {
  const invokers = (e: any) => {
    invokers.value(e)
  }
  invokers.value = value
  return invokers
}
