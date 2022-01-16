<template>
  <div id="app">
    <div>我得名字： {{ $store.getters.getName }}</div>
    <div>我得----： {{ $store.state.age }}</div>
    <button @click="$store.commit('changeName','这是新名字')">同步更新,年纪加 11</button>
    <button @click="$store.dispatch('changeAge')">异步更新</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      storepro: this.$store,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
