<template>
  <div>
    <h1>这是 about</h1>
    <div>
      <router-link to="/about/a">关于 a</router-link>
      <router-link to="/about/b">关于 b</router-link>

      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      a: 111
    }
  },
  methods: {
    mounted(){

    }
  }
}
</script>

<style></style>
