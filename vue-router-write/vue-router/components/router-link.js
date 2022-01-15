export default {
  name: "router-link",
  functional: true,
  props: {
    to: {
      type: String,
      require: true
    },
    tag: {
      type: String
    }
  },
  render(h, context) {
    let tag = context.props.tag || "a"
    const clickHandle = () => {
      context.parent.$router.push(context.props.to)
    }
    return h(
      tag,
      {
        on: {
          click: clickHandle
        }
      },
      context.slots().default
    )
  }
}
