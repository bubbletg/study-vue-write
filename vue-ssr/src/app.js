import Vue from 'vue';
import App from './App.vue';

import createRoute from './createRouter';
export default () => {
  const router = createRoute();
  let app = new Vue({
    el: '#app',
    render: (h) => h(App),
    router,
  });
  return {
    app,
    router,
  };
};
