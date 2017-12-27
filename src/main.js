// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ProgressBar from './components/progressBar.vue'
import immutable from './immutable'
immutable()
import 'element-ui/lib/theme-default/index.css'
import './assets/icon.css'
import richCursor from './word/reg.js'
import ElementUI from 'element-ui'
import contextMenu from './word/contextMenu.vue'
import cursorComponent from './word/line.vue'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(richCursor)
/* eslint-disable no-new */
let menu = Vue.prototype.$contextMenu = new Vue(contextMenu).$mount()
document.body.appendChild(menu.$el)
let cursor = Vue.prototype.$cursor = new Vue(cursorComponent).$mount()
document.body.appendChild(cursor.$el)
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
