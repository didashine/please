<template lang="pug">
  div.contextMenu( ref='contextMenu', @click='contextClick')
    ul.opera_tb
      li( v-for="op in operation", @click='operationClick(op, $event)')
        span {{op.name}}
</template>
<script>
  export default {
    name: 'contextMenu',
    data() {
      return {
        operation: [{
          name: '合并单元格',
          type: 'merge'
        }]
      }
    },
    methods: {
      // 定位
      updatePos(e) {
        let x = e.pageX
        let y = e.pageY
        let contextMenu = this.$refs.contextMenu
        contextMenu.style.left = x+ 'px'
        contextMenu.style.top = y+ 'px'
        contextMenu.style.display = 'block'
      },
      hide(e) {
        let contextMenu = this.$refs.contextMenu
        contextMenu.style.display = 'none'
      },
      contextClick(e) {
        e.stopPropagation()
      },
      operationClick(op, e) {
        e.stopPropagation()
        console.log('hhh')
        this.$emit('operation.click',e, op.type)
        let contextMenu = this.$refs.contextMenu
        contextMenu.style.display = 'none'
      }
    }

  }
</script>
<style lang="stylus">
  .contextMenu
    border-radius 4px
    box-shadow 0px 0px 3px #ececec
    width 200px
    height auto
    position absolute
    display none
    z-index 9999
    background #fff
    ul.opera_tb
      padding 10px 0
      li
        list-style none
        cursor pointer
        padding 12px 10px
        line-height 100%
        font-size 14px
        color #333
        &:hover
          background #ececec


</style>
