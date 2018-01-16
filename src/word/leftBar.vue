<template lang="pug">
  .leftBar( :class="[inLeft ? 'move': '']")
    .left-title
      img( src='/static/bitbug_favicon.ico', width='16')
      span 拖拽绑定内容到编制报告
    .move-switch( @click='inLeft= !inLeft')
      span.icon
    .wrap( ref='wrap')
      .s_tree
        .tree_block( v-for='item in treeData' )
          .tree_title( ref='treeTitle')
            span {{item.name}}
            // .hidden( ref='hiddenFiled') {{data.name}}
          .tree_content( v-if='item.children.length>0')
            .tree_sub_title( v-for='da in item.children' )
              span {{da.name}}
</template>
<script>
  import sTree from './tree.vue'
  import formOrder from './data/formOrder.json'
  import {JsonConvert} from './until/filedParse'
  import {getStyle, getOffset} from './until/dom'
  import drag from './until/drag'
  export default {
    name: 'leftBar',
    data() {
      return {
        inLeft: true,
        treeData:  JsonConvert(formOrder).data
      }
    },
    created() {
      console.log(this.treeData, 'data')
    },
    mounted() {
      this.bindDrag()
    },
    methods: {
      bindDrag() {
        let titles = this.$refs['treeTitle']
        let wrap = this.$refs['wrap']
        for(let i=0;i<titles.length;i++) {
          let filed = drag(titles[i])
          let offset = {}
          let scroll = {}
          let currFiled;
          filed.on('down', (el) => {
            currFiled = this.treeData[i]
            this.$moveBlock.getDom().style.display = 'block'
            offset = {
              left: getOffset(el, 'left'),
              top: getOffset(el, 'top')
            }
            scroll = {
              x: wrap.scrollLeft,
              y: wrap.scrollTop
            }
            // this.$moveBlock.setTo({posX: getStyle(el, '')})
          })
          filed.on('move', (el, {moveX, moveY, e}) => {
            this.$moveBlock.setTo({
              posX: moveX+offset.left-(scroll.x||0),
              posY: moveY+offset.top-(scroll.y||0),
              value: currFiled.name})
            this.$emit('moveblock.move', {e, el, currFiled})
          })
          filed.on('up', (el, {e}) => {
            this.$moveBlock.getDom().style.display = 'none'
            this.$emit('moveblock.up', {e, el, currFiled})
          })
        }
      }
    },
    components: {
      sTree
    }
  }
</script>
<style lang="stylus">
  .leftBar
    position absolute
    width 230px
    padding 0px 0
    box-sizing border-box
    border 1px solid #cc
    border-left none
    left 0
    top 128px
    height 500px
    transform translateX(0)
    transition 0.25s all
    background rgba(253, 253, 253, 1)
    border-radius 0 8px 8px 0
    z-index 6
    .left-title
      border-radius 0 8px 0 0
      // background rgba(246, 246, 246, 1)
      background #eee
      padding 6px 12px
      border-bottom 1px solid #cc
      font-size 14px
      font-weight 500
      img
        margin-right 10px
      img, span
        display inline-block
        vertical-align middle
    .wrap
      box-sizing border-box
      max-height 450px
      overflow-y auto
      overflow-x hidden
      user-select none
    &.move
      transform translateX(-229px)
    .move-switch
      position absolute
      width 24px
      padding 2px
      box-sizing border-box
      background rgba(217, 217, 217, 0.8)
      color #fff
      right -24px
      top 50%
      margin-top -30px
      height 60px
      cursor pointer
      border-radius 0 4px 4px 0
      transition 0.25s all
      box-shadow 0px -1px 1px rgba(217, 217, 217, 1)
      .icon
        background #fff
        border-radius 50%
        width 10px
        height 10px
        display inline-block
        position absolute
        top 50%
        left 50%
        margin-top -5px
        margin-left -7px
        box-shadow -2px 1px 2px #4285f4 inset
      &:hover
        background rgb(148, 211, 245)
    .s_tree
      padding-top 8px
      .tree_block
        padding-bottom 3px
        .tree_title
          color #5a5e66
          color #4285f4
          background #fff
          padding 2px 12px
          cursor pointer
          position relative
          user-select none
          &:hover
            box-shadow 1px 0px 3px #5a5e66
          .hidden
            position absolute
            width 100%
            left 0
            top 0
            opacity 0
        .tree_content
          padding-left 24px
          .tree_sub_title
            color #cc

</style>
