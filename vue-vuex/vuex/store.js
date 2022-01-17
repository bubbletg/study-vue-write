import { forEach } from './utils';
let Vue = null;

class Store {
  constructor(options) {
    const { state, getters } = options;

    this.getters = {};
    const computed = {};

    forEach(getters, (fn, key) => {
      computed[key] = () => fn(this.state);
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
      });
    });

    this._vm = new Vue({
      data: {
        $$state: state,
      },
      computed,
    });
  }
  get state() {
    return this._vm._data.$$state;
  }
}

/**
 * 给每个组件都定义一个 $store 属性
 *
 * vux 与 vue-router 不同的时候，router 是给每个组件都能拿到 根实例
 */
function vuxInit() {
  const options = this.$options;
  if (options.store) {
    // 根实例上存在 $store
    this.$store = options.store;
  } else if (options.parent && options.parent.$store) {
    // 把 父组件 上的 $store 赋值到 子组件上
    this.$store = options.parent.$store;
  }
}

const install = (_Vue) => {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate: vuxInit,
  });
};

export { Store, install };
