import Event from '../until/event'
import {normalBp} from "./core";
import {range} from "./edit";

export let bind = (vm, doc) => {
 let event = new Event()
 let on =  function(...args) {
  let el = args[0]
  let on
  // 非直接绑定dom事件
  if(typeof el === 'string') {
    // 捕获contextmenu事件正则
    let contextmenuReg = /^contextmenu\./
    // 捕获toolbar事件正则
    let toolbarReg = /^toolbar\./
    // toolbar组件事件
    if(toolbarReg.test(el)) {
      let toolBar = this.$refs['toolBar']
      if(!toolBar) throw new Error('没有获取到组件toolBar，解绑或移除该事件')
      args[0] = el.replace(toolbarReg, '')
      on = toolBar.$on.bind(toolBar)
    }
    // contextMenu组件的事件
    else if(contextmenuReg.test(el)) {
      args[0] = el.replace(contextmenuReg, '')
      on = this.$contextMenu.$on.bind(this.$contextMenu) }
    else {
      // 普通自定义事件
      on = event.on.bind(event)
    }
  } else {
    // dom原生事件
    on = event.addEvent.bind(event)
  }
  on(...args)
 }.bind(vm)
  // 注册一些快 捷事件
 let _register = () => {
   let down = false
   let MEvt = {
     onKeyDown: function(fn) {
       event.addEvent(window.document, 'keydown', function(e) {
         fn(e.keyCode, e)
       })
     },
     onKeyUp: function(fn) {
       event.addEvent(window.document, 'keyup', function(e) {
         fn(e.keyCode, e)
       })
     }
   }
   MEvt.onKeyDown((code, e) => {
     if(code == 8) {
       event.trigger('delete.down', e, down)
     }
   })
   MEvt.onKeyUp((code, e) => {
     if(code == 8) {
       event.trigger('delete.up', e, down)
     }
   })
   MEvt.onKeyDown((code, e) => {
     if(code == 13) {
       // console.log('', 'enger')
       event.trigger('enter.down', e, down)
     }
   })
   MEvt.onKeyUp((code, e) => {
     if(code == 13) {
       // console.log('', 'enger')
       event.trigger('enter.up', e, down)
     }
   })
   MEvt.onKeyDown((code, e) => {
     down = true
     if(code == 16) {
       event.trigger('ctrl.down', e, down)
     }
   })
   MEvt.onKeyUp((code, e) => {
     down = false
     if(code == 16) {
       event.trigger('ctrl.up', e, down)
     }
   })

 }
 // 注册快捷
 _register()
 let allEvts = {
   // 监听事件
   on,
   // 解绑所有事件
   offAll: event.offAll
 }
 return allEvts
}
