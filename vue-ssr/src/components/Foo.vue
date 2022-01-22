<template>
  <div class="bar" @click="handleClick">
    foofofofofofofofofofofofofof
    <div>啊啊啊啊啊</div>
    <div>name:{{ $store.state.name }}</div>
    <div>age:{{ age }}</div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    console.log('beforeCreate');
  },
  computed: {
    age() {
      return this.$store.state.age;
    },
  },
  methods: {
    handleClick() {},
  },
  asyncData(store) {
    // 这个方法在后端调用
    return store.dispatch('changeAll');
  },
};
</script>

<style>
.bar {
  color: blueviolet;
}
</style>
