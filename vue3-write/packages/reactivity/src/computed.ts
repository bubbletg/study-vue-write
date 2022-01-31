import { isFunction } from "@vue/shared";
import { effect, trigger, track } from "./effect";
import { TrackOpTypes, TriggerOrType } from "./operators";

class ComputedRefImpl {
  public _dirty = true; // 默认取值时不要缓存
  public _value: any
  public effect: any;
  constructor(getter: any, public setter: any) {
    this.effect = effect(getter, {
      lazy: true, // 默认不执行
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          trigger(this, TriggerOrType.SET, 'value', this._value)
        }
      }
    });
  }

  get value(): any {
    // 计算属性也要收集依赖
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
    }
    // 依赖收集
    track(this, TrackOpTypes.GET, 'value')
    return this._value;
  }

  set value(newValue: any) {
    this.setter(newValue);
  }
}


/**
 * 计算属性
 * @param getterOrOptions 可能是一个 get 方法或者options
 */
export function computed(getterOrOptions: any) {
  let getter;
  let setter;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = () => {
      console.log(`computed value must be readonly`)
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter);
}