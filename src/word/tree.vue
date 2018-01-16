<template lang="pug">
  .s_tree
    .tree_title( v-if='treeData.name')
      span {{treeData.name}}
      .hidden( ref='hiddenFiled') {{treeData.name}}
    .tree_content( v-if='treeData.children')
      s-tree( v-for='data in treeData.children', :treeData="data")
</template>
<script>
  import drag from './until/drag'
  export default {
    name: 'sTree',
    props: {
      treeData: Object
    },
    mounted() {
      // this.nwDoc()
      this.titleDrag()
    },
    methods: {
      titleDrag() {
        let hiddenFiled = this.$refs['hiddenFiled']
        // console.log(hiddenFiled)
        if(hiddenFiled) {
          let titleDrag = drag(hiddenFiled)
          titleDrag.on('down', (el) => {
            el.style.opacity = 1
          })
          titleDrag.on('move', (el, {posX, posY}) => {
            el.style.left = posX+ 'px'
            el.style.top = posY+ 'px'
          })
        }

      },
      nwDoc() {

      },
      down(e) {
//        let el = e.target
//        let event = this.event
//        let cx = e.clientX
//        let cy = e.clientY
//        let olx = e.clientX - el.offsetLeft
//        let oly = e.clientY - el.offsetTop
//        event.addEvent(window.document, 'mousemove', (e) => {
//          let posX = e.clientX -olx
//          let posY = e.clientY -oly
//          el.style.left = posX+ 'px'
//          el.style.top = posY+ 'px'
//        })
        // filddDrag.on()
//        filddDrag.on('down', (el) => {
//          console.log('hdown')
//        })
      }
    },
    created() {
      // this.$options.components.sTree = require('./tree.vue')
    }
  }
</script>
<style lang="stylus">
  .s_tree
    .tree_title
      color #5a5e66
      color #4285f4
      background #fff
      padding 2px 0px
      cursor pointer
      position relative
      .hidden
        position absolute
        width 100%
        left 0
        top 0
        opacity 0
    .tree_content
      padding-left 12px
</style>
