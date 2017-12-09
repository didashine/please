<template lang="pug">
  span.j_drop
    slot( name="down_btn", :curr="curr")

    slot( :curr="curr")

</template>
<script>
  export default {
    name: 'jDrop',
    props: {
      model: null,
      plex: {

      },
      options: {
        type: Array
      },
      prop: {
        type: Object,
        default() {
          return {
            label: 'label',
            id: 'id',

          }
        }
      },
      defaultTxt: {
        default: '执行人'
      }
    },
    created() {
    },
    computed: {
      curr() {
        let id = this.prop['id']
        let txt = this.prop['txt']
        let filter = this.options.filter(option => {
          return option[id] == this.model
        })
        return filter.length ? filter[0] : {
          label: this.defaultTxt,
          id: -1
        }
      }
    }
  }
</script>
<style lang='stylus' scoped>
  .j_drop
    z-index 35
    .item_view
      border 1px solid #D3DCE6
      position absolute
      padding 15px 16px
      background #fff
      z-index 10000
</style>
