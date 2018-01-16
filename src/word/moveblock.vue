<template lang="pug">
  div.moveBlock( ref='moveblock')
    span {{data}}
</template>
<script>
  export default {
    name: 'moveBlock',
    data() {
      return {
        data: ''
      }
    },
    methods: {
      // 定位
      setTo({posX, posY, value}) {
        let moveblock = this.$refs.moveblock
        moveblock.style.left = posX+ 'px'
        moveblock.style.top = posY+ 'px'
        this.data = value
      },
      getDom() {
        return this.$refs['moveblock']
      }
    }

  }
</script>
<style lang="stylus">
  .moveBlock
    top 0
    left 0
    border-radius 4px
    box-shadow 0px 0px 3px #ececec
    border-radius 40px
    width 100px
    text-align center
    height 40px
    font-size 16px
    padding 8px 0
    box-sizing border-box
    position absolute
    cursor pointer
    z-index 9999
    background rgba(225, 225, 225, 0.1)
    pointer-events none
    display none
    span
      cursor pointer
</style>
