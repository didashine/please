// 时间旅行者， 可以在几个版本里面穿梭，简单点讲就是撤回，逆撤回
function timeTraveler(size=100) {
  let history = []
  let version = 0
  let api = {
    // 撤回
    Undo() {
      version = version <= 1 ? 0 : --version
      return history[version]['v']
    },
    // 逆撤回
    Redo() {
      // console.log(version, history, 'hhhh')
      version = version>= (history.length-2) ? history.length-1: ++version
      console.log(version, history[version]['t'], history)
      return history[version]['v']
    },
    record(v) {
      let length = history.push({v, t: new Date()})
      version= --length
      if(length>size) {
        history.shift()
        version <= 1 ? 0 : version--
      }
    }
  }
  return api
}
export default timeTraveler
