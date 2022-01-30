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
export const extend = (val: object, obj: object) => {
  return {
    ...val,
    ...obj,
  }
}