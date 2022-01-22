<template>
  <div id="app">
    <div @click="hello">{{ '22222' + name + '1111' }}</div>
    <router-link to="/foo">Foo</router-link>
    <router-link to="/bar">Bar</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: 'Bubble-App',
    };
  },
  methods: {
    hello() {
      alert(1);
    },
  },
};
</script>

<style>
#app {
  color: red;
}
</style>
