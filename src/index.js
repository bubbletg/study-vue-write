// let app = document.getElementById("app")
import { h, render } from "./vdom"

let oldVnode = h(
  "div",
  { id: "container", key: 1, class: "my-class" },
  h(
    "span",
    {
      key: 2,
      style: { color: "red", backgroundColor: "yellow" },
      class: "my-class"
    },
    "hello"
  ),
  "BubbleTG"
)
let app = document.getElementById("app")

render(oldVnode, app)
console.log(oldVnode)
