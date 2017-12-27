<template lang="pug">
  div.frame
    div.toolbar
      ul.tab-bar
        li( v-for='tool in toolbar',
          @click='active = tool.id', :class="[active == tool.id ? 'active': '']") {{tool.name}}
      .tab
        .format-tab( v-if = 'active == 0')
          down-menu.font-size( :activeId='11', :list='fontSize', :showId='true')
          down-menu.font-family( :activeId='0', :list='fontFamily')
          down-menu.font-headings( :activeId='0', :list='headings')
          span.table( name='表格')
            span( @click='showTable') 表格
            sel-table( v-if='tableShow', @selTableChange='selTableChange')


</template>
<script>
  import downMenu from './downmeun.vue'
  import selTable from './selTable.vue'
  import { fontSize, headings, fontFamily, headingsConfig } from './config/baseConfig'
  export default {
    name: 'toolBar',
    data() {
      return {
        toolbar: [
          {
            name: '开始',
            id: 0
          },{
            name: '插入',
            id: 1
          }
        ],
        tableShow: false,
        // 激活的tool
        active: 0,
        headings: headings,
        fontFamily: fontFamily,
        fontSize: fontSize
      }
    },
    methods: {
      showTable() {
        this.tableShow = !this.tableShow
      },
      selTableChange(scale) {
        this.tableShow = false
        this.$emit('select.table', scale)
      }
    },
    components: {
      downMenu,
      selTable
    }

  }
</script>
<style lang="stylus">
  .frame
    width 100%
    padding-top 20px
    .toolbar
      padding-top 10px
      .tab-bar
        padding-left 80px
        border-bottom 1px solid #ccc
        overflow hidden
        li
          float left
          padding 2px 22px
          color #848484
          border-radius 4px 4px 0 0
          transition 0.25s all
          cursor pointer
          &.active
            color: #4285f4;
            background: #ee
      .tab
        padding 10px 0 10px 80px
        .format-tab
          .table
            padding 3px 12px
            border-right 1px solid #e0e0e0
            border-left 1px solid #e0e0e0
            position relative
            .sel-table
              top 33px
              left 0
          .font-family, .font-size, .font-headings
            border-left 1px solid #e0e0e0
            .btn
              margin 0 2px
              padding 3px 20px


</style>
