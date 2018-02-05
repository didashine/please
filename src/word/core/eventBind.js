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
    let insetComponentBind = (componentEvents) => {
      componentEvents.map(({eventsName, componentName}, i) => {
        let reg = new RegExp('^'+eventsName+'.'+'', 'g');
        if(reg.test(el)) {
          let component = this.$refs[componentName]
          if(!component) throw new Error(`没有获取到组件${componentName}，解绑或移除该事件`)
          args[0] = el.replace(reg, '')
          on = component.$on.bind(component)
        }
      })
    }
    // 捕获contextmenu事件正则
    let contextmenuReg = /^contextmenu\./
    // contextMenu组件的事件
    if(contextmenuReg.test(el)) {
      args[0] = el.replace(contextmenuReg, '')
      on = this.$contextMenu.$on.bind(this.$contextMenu)
    } else {
      // 普通自定义事件
      on = event.on.bind(event)
    }
    // 内部组件事件 .... so ugly
    insetComponentBind(
      [
        {eventsName: 'toolbar', componentName: 'toolBar'},
        {eventsName: 'leftbar', componentName: 'leftBar'}
      ]
    )
  } else {
    // dom原生事件
    on = event.addEvent.bind(event)
  }
  on(...args)
 }.bind(vm)
  // 注册一些快 捷事件
 let _register = () => {
   let down = false
   // ME_EVENT 我的事件
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
     code = e.code
     let numKeyReg = /^Digit(\d)+/
     // console.log(code.match(numKeyReg), 'Digit2')
     let digit = code.match(numKeyReg)
     digit = digit ? digit[1]: -1
     if((0<=digit&&digit<=9)||code === 'Space'||code === 'Enter') {
       event.trigger('complete', e)
     }
   })
   MEvt.onKeyDown((code) => {
     if (code == 91) {
       MEvt.onKeyDown((code, e) => {
         if(code == 90) {
           event.trigger('command+z', e)
         }
       })
     }
   })
   MEvt.onKeyDown((code) => {
     if (code == 91) {
       MEvt.onKeyDown((code, e) => {
         if(code == 90) {
           event.trigger('command+z', e)
         }
       })
     }
   })
   MEvt.onKeyDown((code) => {
     if (code == 91) {
       MEvt.onKeyDown((code, e) => {
         if(code == 89) {
           e.preventDefault()
           event.trigger('command+y', e)
         }
       })
     }
   })
   MEvt.onKeyDown((code, e) => {
     if(code == 8) {
       event.trigger('delete.down', e)
     }
   })
   MEvt.onKeyUp((code, e) => {
     if(code == 8) {
       event.trigger('delete.up', e)
     }
   })
   MEvt.onKeyDown((code, e) => {
     if(code == 13) {
       // console.log('', 'enger')
       event.trigger('enter.down', e)
     }
   })
   MEvt.onKeyUp((code, e) => {
     if(code == 13) {
       // console.log('', 'enger')
       event.trigger('enter.up', e)
     }
   })
   MEvt.onKeyDown((code, e) => {
     down = true
     if(code == 16) {
       event.trigger('ctrl.down', e)
     }
   })
   MEvt.onKeyUp((code, e) => {
     down = false
     if(code == 16) {
       event.trigger('ctrl.up', e)
     }
   })

 }
 // 注册快捷
 _register()
 let allEvts = {
   // 监听事件
   on,
   // 解绑所有事件
   offAll: event.offAll.bind(event),
   trigger: event.trigger.bind(event)
 }
 return allEvts
}
