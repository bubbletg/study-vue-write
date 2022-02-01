export { ShapeFlags } from './shapeFlags'

/**
 * 判断 value 是否为对象
 * @param value
 * @returns
 */
export const isObject = (value: any) => typeof value === 'object' && value !== null

/**
 * 合并两个对象
 * @param val 对象1
 * @param obj 对象2
 * @returns 返回合并后的对象
 */
export const extend = Object.assign

/**
 * 是否数组
 */
export const isArray = Array.isArray

/**
 * 是否方法
 * @param value
 * @returns
 */
export const isFunction = (value: any) => typeof value === 'function'

export const isNumber = (value: any) => typeof value === 'number'
export const isString = (value: any) => typeof value === 'string'

/**
 * 数字类型字符串
 * @param key
 * @returns
 */
export const isIntergerKey = (key: any) => parseInt(key) + '' === key

/**
 * 判断 key 是否为对象 target 的key
 * @param target
 * @param key
 * @returns
 */
export const hasOwn = (target: any, key: any) => Object.prototype.hasOwnProperty.call(target, key)


export const hasChanged = (oldValue: any, newValue: any) => oldValue
  !== newValue