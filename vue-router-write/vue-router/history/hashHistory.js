import History from "./base"

const ensureSlash = () => {
  if (window.location.hash) {
    return
  }
  window.location.hash = "/"
}

export default class HashHistory extends History {
  constructor(router) {
    super(router)
    this.router = router

    // 添加 #/
    ensureSlash()
  }
  /**
   * 获得当前 hash
   */
  getCurrentLocation() {
    return window.location.hash.slice(1) // #/xxx
  }
  setupListener() {
    window.addEventListener("hashchange", () => {
      this.transitionTo(this.getCurrentLocation())
    })
  }
}
