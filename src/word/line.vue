<template lang="pug">
  div.cursor.animation( :style='sty')
</template>
<script>
  export default {
    name: 'cursor',
    data() {
      return {
        sty: {
          top: 0,
          left: 0,
          display: 'none',
          height: 0
        }
      }
    },
    methods: {
      setPos(sty) {
        this.sty = sty
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .cursor
    width 2px
    height 16px
    opacity 0
    background orangered
    position absolute
    @keyframes flash
      0%
        opacity 1
      60%
        opacity 0
      100%
        opacity 1

    &.animation
      animation flash 1s infinite
      // animation-delay: 3.9s;


</style>
