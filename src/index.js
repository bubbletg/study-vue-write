import Vue from "vue"

let vm = new Vue({
  el: "#app",
  data() {
    return {
      msg: "hello world",
      abc: "1111",
      school: {
        name: "bubbletg",
        age: 10
      },
      arr: [{ a: 1 }, 1, 2, 3]
    }
  },
  computed: {},
  watch: {
    abc: {
      immediate: true,
      handler(newValue, oldVaule) {
        console.log("~~~~~~~~~~~~~watch执行了", newValue, oldVaule)
      }
    },
    msg(newValue, oldVaule) {
      console.log("~~~~~~~~~~~~~watch执行了", newValue, oldVaule)
    }
  }
})

setTimeout(() => {
  vm.msg = "1111111"
  vm.msg = "2"
  vm.msg = "3"
  vm.msg = "9"
  vm.abc = 1
}, 1000)
