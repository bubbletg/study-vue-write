<template>
  <div class="bar" @click="handleClick">bar</div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      alert(1);
    },
  },
};
</script>

<style>
.bar {
  color: blueviolet;
}
</style>
