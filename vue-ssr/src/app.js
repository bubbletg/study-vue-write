import Vue from 'vue';
import App from './App.vue';

import createRoute from './createRouter';
import createStore from './createStore';

export default () => {
  const router = createRoute();
  const store = createStore();
  let app = new Vue({
    el: '#app',
    render: (h) => h(App),
    router,
    store,
  });
  return {
    app,
    router,
    store,
  };
};
