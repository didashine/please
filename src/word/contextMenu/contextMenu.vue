<template lang="pug">
  div.contextMenu( ref='contextMenu', @click='contextClick', v-show='cMshow')
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
        }],
        cMshow: false
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
        console.log('....')
        this.cMshow = true
        // contextMenu.style.display = 'block'
      },
      hide(e) {
        let contextMenu = this.$refs.contextMenu
        this.cMshow = false
      },
      contextClick(e) {
        e.stopPropagation()
      },
      operationClick(op, e) {
        e.stopPropagation()
        this.$emit('operation.click',e, op.type)
        this.cMshow = false
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
    z-index 9999
    background #fff
    top 0
    left 0
    ul.opera_tb
      padding 2px 0
      li
        list-style none
        cursor pointer
        padding 8px 10px
        line-height 100%
        font-size 14px
        color #333
        &:hover
          background #ececec


</style>
