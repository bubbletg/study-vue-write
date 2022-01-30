import { hasChanged, isArray, isObject } from "@vue/shared";
import { reactive } from ".";
import { track, trigger } from "./effect";
import { TrackOpTypes, TriggerOrType } from "./operators";

export function ref(value: any): object {
  return createRef(value);
}

export function shallowRef(value: any): object {
  return createRef(value, true);
}


const convert = (value: any) => isObject(value) ? reactive(value) : value

class RefImpl {
  public _value: any;
  public __v_isRef: boolean = true;
  constructor(public rawValue: any, public isShallow: boolean) {
    this._value = isShallow ? rawValue : convert(rawValue);
  }

  get value(): object {
    track(this, TrackOpTypes.GET, 'value');
    return this._value;
  }

  set value(newValue: any) {
    if (hasChanged(newValue, this.rawValue)) {
      this.rawValue = newValue;
      this._value = this.isShallow ? newValue : convert(newValue)
      trigger(this, TriggerOrType.SET, 'value', newValue);
    }
  }
}

function createRef(rawValue: any, isShallow: boolean = false): object {
  return new RefImpl(rawValue, isShallow);
}


class ObjectRefImpl {
  public __v_isRef: boolean = true;
  constructor(public target: any, public key: any) {

  }

  get value(): object {
    return this.target[this.key]
  }

  set value(newValue: any) {
    this.target[this.key] = newValue
  }
}

/**
 * 把一个对象的值 转换为 变为 ref类型
 * @param target 对象
 * @param key
 */
export function toRef(target: any, key: any): object {
  return new ObjectRefImpl(target, key)
}

export function toRefs(object: any): any {
  const tmpObj: any = {}
  const ret = isArray(object) ? new Array(object.length) : tmpObj
  for (const key in object) {
    ret[key] = toRef(object, key)
  }
  return ret

}