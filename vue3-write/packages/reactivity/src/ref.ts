import { hasChanged, isObject } from "@vue/shared";
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

