import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export default () => {
  let store = new Vuex.Store({
    state: {
      name: 'bubbleTg',
      age: 25,
    },
    mutations: {
      changeAge(state) {
        state.age = state.age * 10;
      },
      changeName(state) {
        state.name = state.name + '最速爱';
      },
    },
    actions: {
      changeAll({ commit }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commit('changeAge');
            commit('changeName');
            resolve();
          }, 3000);
        });
      },
    },
  });
  return store;
};
