import ModuleCollections from './module/module-collections';
import { forEach } from './utils';
let Vue = null;

/**
 * 通过 path 拿到 store 最新的状态
 * @param {*} store
 * @param {*} path
 * @returns
 */
function getState(store, path) {
  return path.reduce((newState, current) => {
    return newState[current];
  }, store.state);
}

function installModule(store, rootState, path, module) {
  let namespace = store._modules.getNamespace(path);

  // 如果子模块，需要将子模块的状态定义到根模块上
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, store);
    // 这个api 可以增加属性
    Vue.set(parent, path[path.length - 1], module.state);
  }
  module.forEachMutation((mutation, type) => {
    store._mutations[namespace + type] = store._mutations[namespace + type] || [];
    store._mutations[namespace + type].push((payload) => {
      mutation.call(store, getState(store, path), payload);

      store._subscribers.forEach((subscriber) => subscriber({ mutation, type }, store.state));
    });
  });

  module.forEachAction((action, type) => {
    store._actions[namespace + type] = store._actions[namespace + type] || [];
    store._actions[namespace + type].push((payload) => {
      action.call(store, store, payload);
    });
  });

  module.forEachGetters((getter, key) => {
    store._wrappedGetters[namespace + key] = () => {
      return getter(getState(store, path));
    };
  });

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child);
  });
}

function resetStoreVm(store, state) {
  const wrappedGetters = store._wrappedGetters;

  let oldVm = store.vm;
  let computed = {};
  store.getters = {};

  forEach(wrappedGetters, (fn, key) => {
    computed[key] = function () {
      return fn();
    };

    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
    });
  });

  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });

  // 销毁老的 vm
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy());
  }
}

class Store {
  constructor(options) {
    // 收集模块，把模块转换为一颗模块书
    this._modules = new ModuleCollections(options);

    let state = this._modules.root.state;

    this._mutations = {}; // 存放所有模块中的 mutations
    this._actions = {}; // 存放所有模块中的 _actions
    this._wrappedGetters = {}; // 存放所有模块中的 _wrappedGetters

    this._subscribers = [];
    // 安装模块
    installModule(this, state, [], this._modules.root);

    resetStoreVm(this, state);

    options.plugins.forEach((plugin) => plugin(this));
  }
  subscribe(fn) {
    this._subscribers.push(fn);
  }
  replaceState(newState) {
    this._vm._data.$$state = newState;
  }
  commit = (type, payload) => {
    this._mutations[type].forEach((fn) => fn(payload));
  };

  dispatch = (type, payload) => {
    this._actions[type].forEach((fn) => fn(payload));
  };

  get state() {
    return this._vm._data.$$state;
  }

  /**
   * 注册模块
   */
  registerModule(path, rawModule) {
    if (typeof path === 'string') path = [path];
    // 模块注册
    this._modules.register(path, rawModule);

    // 安装
    installModule(this, this.state, path, rawModule.newModule);
    // 重新定义 getters
    resetStoreVm(this, this.state);
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
