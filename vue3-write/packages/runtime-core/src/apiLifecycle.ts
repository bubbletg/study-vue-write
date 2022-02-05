import { currentInstance, setCurrentInstance } from "./component";

export const enum LifecycleHooks {
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
  BEFORE_UNMOUNT = 'bum',
  UNMOUNTED = 'um',
  DEACTIVATED = 'da',
  ACTIVATED = 'a',
  RENDER_TRIGGERED = 'rtg',
  RENDER_TRACKED = 'rtc',
  ERROR_CAPTURED = 'ec',
  SERVER_PREFETCH = 'sp'
}

// 执行具体的勾子
const injectHook = (lifecycle: LifecycleHooks, hook: any, target: any) => {
  if (!target) {
    return console.warn('警告')
  } else {
    // 拿到对应的勾子
    const hooks = target[lifecycle] || (target[lifecycle] = [])

    // 该方法保证 hook 执行时候，组件实例永远指向自己。
    const wrap = () => {
      setCurrentInstance(target)
      hook.call(target)
      setCurrentInstance(null)
    }
    // 存放勾子
    hooks.push(wrap)
  }
}

// 创建生命周期勾子
const createHook = (lifecycle: LifecycleHooks) => (hook: any, target = currentInstance) => {
  // 给当前实例 增加 对应生命周期
  injectHook(lifecycle, hook, target)
}

// 执行所有勾子
export const invokeArrayFns = (fns: any) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i]()
  }
}

export const onBeforeMount = createHook(LifecycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifecycleHooks.MOUNTED);
export const onBeforeUpdate = createHook(LifecycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifecycleHooks.UPDATED);
