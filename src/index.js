import Vue from "vue"

let vm = new Vue({
  el: "#app",
  data() {
    return {
      msg: "hello world",
      school: {
        name: "bubbletg",
        age: 10
      },
      arr: [{a:1},1, 2, 3]
    }
  },
  computed: {},
  watch: {}
})

console.log(vm);

console.log(vm.arr[0]['a'] ='1111111')
console.log(vm.arr[0])

// vm.arr.splice(0,1,{b:'11111'})
vm.arr.push({ab:'11111'})
console.log(vm.arr);


setTimeout(() => {
  vm.msg = '1111111'
  vm.msg = '2'
  vm.msg = '3'
  vm.msg = '9'
},1000)
