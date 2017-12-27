// new Event(el, vm)
// el 需要绑定dom 不必填
// vm 当前组件对象 不必填

let isVue = (vm) => {
  if(!vm) return false
  // 暂时没有找到判断vue类型的方法，先用构造器简单替代
  if(vm.constructor.name === 'VueComponent') {
    return true
  }
  return false
}
// 打印组件路径
let getPath = (component) => {
  let getName = (component) => {
    let name = component.$options.name
    return name ? ('<'+ name +'/>') : '<anonymous/>'
  }
  let path = []
  if(!component.DID_NOT_SET) {
    path.push(getName(component))
    let parent = component.$parent
    while(parent) {
      let name = getName(parent)
      path.push( name ? name: '<anonymous/>')
      parent = parent.$parent
    }
    path[path.length- 1] = '<root/>'
  }else {
    path = ['<anonymous/>']
  }
  let path_str = ''
  path.map((pt, i) => {
    let n = ''
    for(let o= i; o> 0; o--) {
      n+=' '
    }
    path_str+=((i> 0 ? '\n': '')+ n+ pt)
  })
  return path_str+ '\n'
}
class Event {
  constructor(el, component) {
    if(isVue(el)) {
      component = el
      el = undefined
    }
    this.el = el
    this.component = component || {$options: {name: 'NO_NAME'}, DID_NOT_SET: true}
    this.eventLists = {
    }
  }
  do() {

  }
  on(type, fn) {
    let evts = this.eventLists[type]
    if(evts&&evts.handle) { evts['handle'].push(fn) }
    else {
      this.eventLists[type] = {handle: [fn], type: 'custom'}
    }
    return this.eventLists[type]['handle'].slice(-1)[0]
  }
  off(type) {
    let evts = this.eventLists[type]
    if(evts&&evts.handle) { this.eventLists[type] = {} }
    else {
      console.warn('no that events')
    }
    if(process.env.NODE_ENV === 'development') {
      // console.log(window.location.href)
      console.info("%c%s",
        "color: #4da1ff",`${getPath(this.component)}已移除${type}事件`)
    }
    return this.eventLists[type]
  }
  trigger(type, ...args) {
    let evts = this.eventLists[type]
    if(evts&&evts.handle) {
      let handle = evts['handle']
      handle.map((e, index) => {
        e(...args)
      })
    }
  }
  addEvent(el, type, fn) {
    if(typeof el == 'string') {
      fn = type
      type = el
      el = this.el
    }
    let eventFn = this.on(type, fn)
    this.eventLists[type].type = 'origin'
    this.eventLists[type].el = el
    el.addEventListener(type, eventFn)
  }
  // 清除所有事件
  offAll() {
    let lists = this.eventLists
    for(let type in lists) {
      let evts = lists[type]
      let evtsType = evts['type']
      if(evtsType === 'origin') {
        this.removeEvent(type)
      }else {
        this.off(type)
      }
    }
  }
  removeEvent(el, type) {
    if(typeof el == 'string') {
      type = el
      el = this.el
    }
    let evts = this.eventLists[type]
    if(evts&&evts.handle) {
      let handle = evts['handle']
      el = el || evts['el']
      handle.map((e, index) => {
        el.removeEventListener(type, e)
      })
      this.off(type)
    }else {
      console.warn('no that events')
    }
  }
}
export default Event
