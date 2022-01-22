<template>
  <div id="app">
    <div @click="hello">{{ '22222'+  name + '1111' }}</div>
    <Bar />
    <Foo />
  </div>
</template>

<script>
import Bar from './components/Bar.vue';
import Foo from './components/Foo.vue';
export default {
  components: {
    Bar,
    Foo,
  },
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
#app{
  color:red;
}
</style>
