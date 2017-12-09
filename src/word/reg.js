import richCursor from './richCursor.vue'
export default {
  install(Vue, option={}) {
   let vueComponent = Vue.component('richCursor', richCursor)
   //let cursor = new vueComponent().$mount()
   // document.body.appendChild(cursor.$el)
   // Vue.prototype.$richCursor = cursor
  }
}
