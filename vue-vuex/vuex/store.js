import { forEach } from './utils';
let Vue = null;

class Store {
  constructor(options) {
    const { state, getters, mutations, actions } = options;

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

    // 采用发布订阅模式， 将用户定义的 mutation 和action 保存起来，当用户调用 commit 时，就找 订阅的 mutation ,调用 dispatch 就找 actions 方法

    this._mutations = {};
    this._actions = {};

    forEach(mutations, (fn, type) => {
      this._mutations[type] = (payload) => fn.call(this, this.state, payload);
    });
    forEach(actions, (fn, type) => {
      this._actions[type] = (payload) => fn.call(this, this, payload);
    });
  }
  commit = (type, payload) => {
    this._mutations[type](payload);
  };

  dispatch = (type, payload) => {
    this._actions[type](payload);
  };

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
