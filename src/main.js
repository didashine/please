// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//import App from './Hi'
import router from './router'
import ProgressBar from './components/progressBar.vue'
import immutable from './immutable'
import colorPicker from './vue-color-picker'
immutable()
import 'element-ui/lib/theme-default/index.css'
import './assets/icon.css'
import ElementUI from 'element-ui'
import contextMenu from './word/contextMenu/contextMenu.vue'
import moveBlock from './word/moveblock.vue'
Vue.config.productionTip = false
Vue.use(colorPicker)
Vue.use(ElementUI);
/* eslint-disable no-new */
let menu = Vue.prototype.$contextMenu = new Vue(contextMenu).$mount()
document.body.appendChild(menu.$el)
let block = Vue.prototype.$moveBlock = new Vue(moveBlock).$mount()
document.body.appendChild(block.$el)
// let cursor = Vue.prototype.$cursor = new Vue(cursorComponent).$mount()
// document.body.appendChild(cursor.$el)
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
