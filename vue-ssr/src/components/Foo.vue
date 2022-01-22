<template>
  <div class="bar" @click="handleClick">foofofofofofofofofofofofofof
    <div>
      啊啊啊啊啊
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate(){
    console.log('beforeCreate');
  },
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
