import Vue from 'vue';
import Vuex, { Store } from '../../vuex';

Vue.use(Vuex);

const store = new Store({
  // 组件状态
  state: {
    age: '100',
    name: 'BubbleTg',
    a: 'aaaa',
  },
  // 获得属性
  getters: {
    getAge(state) {
      return state.age + 1000;
    },

    // 是一个计算属性
    getName(state) {
      console.log('1111111aaaaaaaa');
      return `${state.name}----${state.age}`;
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
  modules: {
    aa: {
      namespaced: true,
      state: {
        c: 100,
      },
      mutations: {
        getC(state) {
          return state.c + 1000;
        },
      },
      modules: {
        aaa: {
          namespaced: true,
          state: {
            aaaab: 111,
          },
          getters: {
            getAaaa(state) {
              return state.aaaab + 1000;
            },
          },
          modules: {
            aaaabbb: {
              namespaced: true,
              state: {
                aaaabbbCCC: 111,
              },
            },
          },
        },
      },
    },
    ba: {
      namespaced: true,
      state: {
        d: 200,
      },
      mutations: {
        changeD(state) {
          console.log('🚀 ~ file: index.js ~ line 59 ~ changeD ~ state', state);
          return state.d + 1000;
        },
      },
      ations: {
        changeD({ commit }) {
          console.log('🚀 ~ file: index.js ~ line 65 ~ changeD ~ commit', commit);
          setTimeout(() => {
            commit('changeD', 'BubbleTg');
          }, 3000);
        },
      },
    },
  },
});

store.registerModule(['ba', 'f'], {
  state: {
    myAge: 100,
  },
});
console.log("🚀 ~ file: index.js ~ line 103 ~ store", store)

export default store;

/**
 * 1. 默认模块没有作用域 问题
 * 2. 状态不要和模块名字相同
 * 3. 默认计算属性 直接通过getters 取值
 * 4. 如果增加 namespaced:true 会将这个模块的属性封装到这个作用越下
 * 5. 默认会找当前模块上是否有 namespace, 且将父级的 namespace 一同算上，作为命名空间
 */
