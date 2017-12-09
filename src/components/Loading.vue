<template lang="pug">
  div.motion_ball_loading
    i(v-for="i in 3", :key="i")
</template>
<script>
  export default {
    name: 'Loading'
  }
</script>
<style lang="stylus" scoped>

  .motion_ball_loading
    position absolute
    i
      display inline-block
      margin 0 3px
      width 16px
      height 16px
      background #A6A6A6
      border-radius 50%
      &.blue
        background linear-gradient(65deg,#00ffee 0%, #ffffff 77%)
        opacity 0.4
      @keyframes loads
        0%
          transform scale(1, 1)
          opacity 1
        50%
          transform scale(0.3, 0.3)
          opacity 0.6
        100%
          transform scaleY(1, 1)
          opacity 1
      &:nth-child(3)
        animation loads 1s ease-in 0.1s infinite
      &:nth-child(2)
        animation loads 1s ease-in 0.3s infinite
      &:nth-child(1)
        animation loads 1s ease-in 0.5s infinite
</style>
