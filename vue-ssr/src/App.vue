<template>
  <div>
    <div>{{ name }}</div>
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
};
</script>

<style></style>
