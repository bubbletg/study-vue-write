import Module from './module';
import { forEach } from '../utils';

export default class ModuleCollections {
  constructor(options) {
    // 注册模块的方法
    this.register([], options, 'root');
  }
  register(path, rootModule, moduleName) {
    let newModule = new Module(rootModule, moduleName);
    rootModule.newModule = newModule;

    if (path.length === 0) {
      this.root = newModule;
    } else {
      // 找到 父亲
      // path.slice(0, -1) => [1,2,3].slice(0,-1) => [1,2]
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChildren(current);
      }, this.root);
      // 向子模块中添加
      parent.addChild([path[path.length - 1]], newModule);
    }

    if (rootModule.modules) {
      forEach(rootModule.modules, (module, moduleName) => {
        this.register([...path, moduleName], module, moduleName);
      });
    }
  }

  getNamespace(path) {
    let root = this.root;
    return path.reduce((namespace, key) => {
      root = root.getChildren(key);
      return namespace + (root.namespaced ? key + '/' : '');
    }, '');
  }
}
