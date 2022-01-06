import { nextTick } from "../util/next-tick"

let queue = []
let has = {}

function flushSchedularQueue() {
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
}

export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    nextTick(flushSchedularQueue)
  }
}
