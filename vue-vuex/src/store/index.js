import Vue from 'vue';
import Vuex, { Store } from '../../vuex';

Vue.use(Vuex);

export default new Store({
  // 组件状态
  state: {
    age: '100',
    name: 'BubbleTg',
  },
  // 获得属性
  getters: {
    getAge(state) {
      return state.age + 1000;
    },

    // 是一个计算属性
    getName(state) {
      return `${state.name}1111111`;
    },
  },
  // 唯一改变状态的方法
  mutations: {
    changeName(state, name) {
      state.name = name;
      state.age += 11;
    },
  },

  // 通过 actions 可以发起请求
  actions: {
    changeAge({ commit }) {
      setTimeout(() => {
        // 调用  changeName 方法，传递的参数是 BubbleTg
        commit('changeName', 'BubbleTg');
      }, 1000);
    },
  },
  modules: {},
});
