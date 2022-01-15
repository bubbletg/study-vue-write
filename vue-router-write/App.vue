<template>
  <div>
    <h1>导航</h1>
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  mounted() {
    console.log(this.$router, this.$route)
  }
}
</script>

<style></style>
