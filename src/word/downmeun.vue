<template lang="pug">
  div.drop_down
    span.btn( @click='downShow = true', ref='btn') {{activeName}}
    ul.down_menu( v-if='downShow')
      li( v-for="l in list", @click='itemClick(l)')
        span {{showId ? l.id: l.name}}
</template>
<script>
  import Event from './until/event'
  let event = new Event()
  export default {
    name: 'downmenu',
    props: {
      activeId: {
        type: [Number,String],
        default: 0
      },
      list: {
        type: Array
      },
      showId: {
        type: Boolean
      },
      tooltype: String,
      prop: {
        type: Object,
        default() {
          return {
            id: 'id',
            name: 'name'
          }
        }
      }
    },
    data() {
      return {
        downShow: false,
        active: this.activeId
      }
    },
    computed: {
      activeName() {
        if(this.showId) {
          return this.active
        }
        let prop = this.prop
        let id = prop['id']
        let name = prop['name']
        for(let i = 0;i<this.list.length;i++) {
          if(this.list[i][id] == this.active) {
            return this.list[i][name]
          }
        }

      }
    },
    mounted() {
      event.addEvent(window.document, 'click', (e) => {
        // this.downShow = false
        if(e.target !== this.$refs['btn']) {
          this.downShow = false
        }
      })
    },
    watch: {
      activeId(newId) {
        this.active = newId
      }

    },
    destoryed() {
      event.offAll()
    },
    methods: {
      itemClick(item) {
        let prop = this.prop
        let id = prop['id']
        this.active = item[id]
        this.$emit('itemChange', item, this.tooltype)
        this.downShow = false
      }
    }
  }
</script>
<style lang="stylus">
  .drop_down
    display inline-block
    color #848484
    cursor pointer
    position relative
    .btn
      padding-top 3px
      padding-bottom 3px
      display block
      &:hover
        background: #ee
    ul.down_menu
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      position absolute
      background #fff
      max-height 400px
      overflow auto
      width 120px
      left 0px
      top 34px
      z-index 200
      li
        padding 6px 30px 6px 30px
        color #333
        cursor pointer
        &:hover
          background #ececec
</style>
