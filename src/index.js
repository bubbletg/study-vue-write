// let app = document.getElementById("app")
import { h, render, patch } from "./vdom"

// let oldVnode = h(
//   "div",
//   { id: "container", key: 1,style:{backgroundColor:'blue'}, class: "my-class" },
//   h(
//     "span",
//     {
//       key: 2,
//       style: { color: "red", backgroundColor: "yellow" },
//       class: "my-class"
//     },
//     "hello"
//   ),
//   "BubbleTG"
// )
let oldVnode = h(
  "div",
  { id: "aaa" },
  h("li", { style: { backgroundColor: "yellow" }, key: "a" }, "a"),
  h("li", { style: { backgroundColor: "yellow" }, key: "b" }, "b"),
  h("li", { style: { backgroundColor: "blue" }, key: "d" }, "d"),
  h("li", { style: { backgroundColor: "pink" }, key: "e" }, "e"),
  h("li", { style: { backgroundColor: "red" }, key: "f" }, "f")
)

let app = document.getElementById("app")

render(oldVnode, app)
console.log(oldVnode)

// let newVnode = h(
//   "div",
//   { id: "aa", style: { backgroundColor: "yellow" } },
//   h("span", { style: { color: "blue" } }, "world")
// )

let newVnode = h(
  "div",
  { id: "bbb" },
  h("li", { style: { backgroundColor: "red" }, key: "f" }, "f"),
  h("li", { style: { backgroundColor: "yellow" }, key: "a" }, "a"),
  h("li", { style: { backgroundColor: "yellow" }, key: "b" }, "b"),
  h("li", { style: { backgroundColor: "blue" }, key: "d" }, "d"),
  h("li", { style: { backgroundColor: "pink" }, key: "e" }, "e"),
)

setTimeout(() => {
  patch(oldVnode, newVnode)
}, 1000)
