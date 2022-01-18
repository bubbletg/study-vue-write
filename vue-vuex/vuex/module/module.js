import { forEach } from '../utils';

export default class Module {
  constructor(rootModule, moduleName) {
    this._raw = rootModule;
    this._children = {};
    this.state = rootModule.state;
    this._rawName = moduleName;
  }
  get namespaced() {
    return this._raw.namespaced;
  }
  getChildren(key) {
    return this._children[key];
  }
  addChild(key, value) {
    this._children[key] = value;
  }

  forEachMutation(fn) {
    const mutations = this._raw.mutations;
    if (mutations) {
      forEach(mutations, fn);
    }
  }
  forEachAction(fn) {
    const actions = this._raw.actions;
    if (actions) {
      forEach(actions, fn);
    }
  }
  forEachGetters(fn) {
    const getters = this._raw.getters;
    if (getters) {
      forEach(getters, fn);
    }
  }
  forEachChild(fn) {
    forEach(this._children, fn);
  }
}
