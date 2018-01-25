<template lang="pug">
  transition(  name="jf-alert-fade" )
    div.jf_alert( v-if='close')
      .jf_alert_top
      .jf_alert_body
</template>
<script>
  export default {
    name: 'jfAlert',
    data() {
      return {
        close: false
      }
    }
  }
</script>
<style lang="stylus">
  .jf_alert
    width 220px
    position relative
    border-radius 4px
    box-shadow 1px 1px 4px #ccc
    transition 0.3s all
    .jf_alert_top
      padding 4px 8px
      position relative
      .close
        position absolute
        width 8px
        height 8px
        background indianred
        border-radius 50%
        top 4px
        left 8px
        cursor pointer
    .jf_alert_body
      padding 12px 0 20px 0
      text-align center
      color #1f2f3d


</style>
