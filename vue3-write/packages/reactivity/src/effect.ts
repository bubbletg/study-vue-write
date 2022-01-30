
interface EffectFunction extends Function {
  id: number,
  _isEffect: boolean,
  raw: Function,
  options: object
}


/**
 * @param fn 方法
 * @param options 配置
 */
export function effect(fn: Function, options: any = {}): Function {
  //  effect 是响应式的，数据变化重新执行
  const effect = createReactiveEffect(fn, options);

  // 默认effect 是先执行的
  if (!options.lazy) {
    effect()
  }

  return effect
}

let activeEffect: EffectFunction; // 存储当前的effect
let uid = 0;
const effectStack: EffectFunction[] = [];
function createReactiveEffect(fn: Function, options: any = {}): EffectFunction {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      try {
        effectStack.push(effect);
        activeEffect = effect
        return fn() // 函数执行，执行 proxy 代理对象的get 方法
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++;
  effect._isEffect = true; // 用于标识这个是个响应式 effect
  effect.raw = fn;
  effect.options = options;

  return effect
}


/**
 * 用于维护 target 的key 与 effect 之间的关系
 * targetMap ===>  WeakMap key => target -- value (map)=>{ key => Set }
 */
const targetMap: any = new WeakMap()

/**
 * 让 target 的 key 收集当前他对应的 effect 函数
 * @param target 响应式对象
 * @param type 类型
 * @param key target 的 key
 */
export function track(target: object, type: any, key: any) {
  if (activeEffect === undefined) { // 当target 的 key 没有在 effect 中使用，不用收集依赖
    return
  }

  let depsMap  = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
}
