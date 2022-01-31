import { isArray, isIntergerKey } from "@vue/shared";
import { TriggerOrType } from "./operators";

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
 * 依赖收集
 * @param target 响应式对象
 * @param type 类型
 * @param key target 的 key
 */
export function track(target: object, type: any, key: any) {
  if (activeEffect === undefined) { // 当target 的 key 没有在 effect 中使用，不用收集依赖
    return
  }

  let depsMap = targetMap.get(target)
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


/**
 * 找属性对应的 effect 让其执行
 * 派发更新
 * @param target 对象
 * @param type 类型
 * @param key key
 * @param newValue 新value
 * @param oldValue 老value
 */
export function trigger(target: any, type: any, key: any, newValue: any, oldValue?: any) {
  // 没有收集依赖，effect,那就不需要任何操作
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  const effects = new Set()
  const effectsAdd = (dep: unknown[]) => {
    if (dep) {
      dep.forEach((effect: unknown) => {
        effects.add(effect);
      })
    }
  }

  // 将所有 要执行的 effect 存储在一个新的结合中，最终一起执行
  // 1. 看是否修改为数组的长度，因为修改长度影响比较大
  if (key === 'length' && isArray(target)) {
    // 所有依赖更新
    depsMap.forEach((dep: unknown[], value: string | number) => {
      if (key === 'length' || value > newValue) {
        // 如果修改的长度小于索引，这个索引也需要触发 effect 重新执行
        effectsAdd(dep)
      }
    });
  } else {
    // 2. 修改
    if (key != null) { // 这里是修改 响应式对象
      effectsAdd(depsMap.get(key))
    }

    switch (type) {
      case TriggerOrType.ADD:
        // 数组添加一个索引，对长度进行依赖收集
        if (isArray(target) && isIntergerKey(key)) {
          effectsAdd(depsMap.get('length'))
        }
        break;
    }
  }
  // 更新
  effects.forEach((effect: any): any => {
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  })

}