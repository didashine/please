import {dateFormat} from './until'
// 时间旅行者， 可以在几个版本里面穿梭，简单点讲就是撤回，逆撤回
let record = function (v, other) {
  return {
    v,
    t: new Date(),
    hash: new Date().getTime(),
    ...other
  }
}
function timeTraveler(size=100) {
  let history = []
  let version = 0
  let api = {
    log(commit) {
      console.group("%c%s", "color: #00CD00", "记录日志");
      console.info(
        "%c%s",
        "color: #CD3333",
        `[${dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')}]: [#${commit}#]了一条数据\n`,
        )
      console.info(
        "%c%s",
        "color: #4da1ff",
        '记录: ',
        history,
        '\n',
      )
      console.info(
        "%c%s",
        "color: #4da1ff",
        '可最多记录个数: ',
        `${size}\n`,
      )
      console.info(
        "%c%s",
        "color: #4da1ff",
        '当前记录数量: ',
        `${history.length}\n`,
      )
      console.info(
        "%c%s",
        "color: #4da1ff",
        '记录指针(当前记录): ',
        'record'+version,
        '\n',
      )
      console.info(
        "%c%s",
        "color: #4da1ff",
        `${commit}的记录数据: `,
        history[version]? history[version]['v']: null,
        '\n'
      )
      console.info(
        "%c%s",
        "color: #4da1ff",
        `${commit}的记录时间: `,
        `${history[version]? dateFormat(history[version]['t'], 'yyyy-MM-dd hh:mm:ss'): null}`
      )
      console.groupEnd()

    },
    // 撤回
    Undo() {
      version = version <= 1 ? 0 : --version
      api.log('撤回')
      return history[version]['v']
    },
    // 逆撤回
    Redo() {
      version = version>= (history.length-2) ? history.length-1: ++version
      api.log('重做')
      return history[version]['v']
    },
    record(v, other) {
      let length = history.push(record(v, other))
      version= --length
      if(length>size) {
        history.shift()
        version <= 1 ? 0 : version--
      }
      api.log('记录')
    },
    history() {
      return history
    }
  }
  return api
}
export default timeTraveler
