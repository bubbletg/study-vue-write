<template>
  <div id="app">
    <div>我得名字： {{ getName }}</div>
    <div>我得----： {{ a }}</div>
    <!-- <div>我得----： {{ $store.state.aa }}</div> -->
    <!-- <div>我得----： {{ $store.state.ba}}</div> -->
    <!-- <button @click="$store.state.a += 1000">同步更新,年纪加 11</button> -->
    <button @click="changeName('这是新名字')">同步更新,年纪加 11</button>
    <button @click="changeAge('changeAge')">异步更新</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from '../vuex';
export default {
  name: 'App',
  data() {
    return {
      storepro: this.$store,
    };
  },
  computed: {
    ...mapState(['a']),
    ...mapGetters(['getName']),
  },
  mounted() {},
  methods: {
    ...mapMutations(['changeName']),
    ...mapActions(['changeAge']),
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
