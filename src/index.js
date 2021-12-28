import Vue from "vue"

let vm = new Vue({
  el: "#app",
  data() {
    return {
      msg: "BubbleTG"
    }
  },
  render(h) {
    return h(
      "div",
      {
        id: "a",
        style: {
          backgroundColor: "red"
        }
      },
      this.msg
    )
  }
})

setTimeout(() => {
  vm.msg = "~~~~~~~~~~~~~~~TG-bubbletg"
}, 3000)
