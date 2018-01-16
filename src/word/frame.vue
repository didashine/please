<template lang="pug">
  div.frame
    div.toolbar( contenteditable='true')
      ul.tab-bar
        li( v-for='tool in toolbar',
          @click='active = tool.id', :class="[active == tool.id ? 'active': '']") {{tool.name}}
      h1.reset( @click='reset') 重做
      .tab
        .format-tab( v-if = 'active == 0')
          span.text-align(@click='bpChange("center", "textAlign")') C
          span.text-decoration(@click='itemChange("textDecoration")') U
          down-menu.font-size( :activeId='normalConf.bpTxt.fontSize', :list='fontSize',tooltype="fontSize", :showId='true', @itemChange='itemChange')
          down-menu.font-family( :activeId='normalConf.bpTxt.fontFamily', :list='fontFamily', tooltype="fontFamily", @itemChange='itemChange')
          down-menu.font-headings( :activeId='normalConf.bp.headings', :list='headings', tooltype="heads", :prop="{id: 'name', name: 'name'}")
          span.table( name='表格')
            span.icon( @click='showTable')
              img( width='20', src='/static/table.png')
            sel-table( v-if='tableShow', @selTableChange='selTableChange')
          span.components( name="组件")
            span.icon
              img( width='20', src='/static/comonents.png')


</template>
<script>
  import downMenu from './downmeun.vue'
  import selTable from './selTable.vue'
  import {clearStore} from './until/until'
  import { fontSize, headings, fontFamily, headingsConfig, NORMAL_CONFIG } from './config/baseConfig'
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
        underLine: false,
        tableShow: false,
        // 激活的tool
        active: 0,
        headings: headings,
        fontFamily: fontFamily,
        fontSize: fontSize,
        normalConf: NORMAL_CONFIG
      }
    },
    methods: {
      reset() {
        clearStore('worderData')
        location.reload()
      },
      setValue(conf) {
        this.normalConf = conf
      },
      bpChange(value, tooltype) {
        this.$emit('select.bp', value, tooltype)
      },
      itemChange(value, tooltype) {
        if(tooltype === undefined) {
          if(value === 'textDecoration') {
            let textDecoration = this.normalConf.bpTxt['textDecoration']
            this.normalConf.bpTxt['textDecoration'] = textDecoration === 'none' ? 'underline': 'none'
            this.$emit('select.font', this.normalConf.bpTxt['textDecoration'], 'textDecoration')
            return;
          }
        }
        this.$emit('select.font', value, tooltype)
      },
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
      position relative
      padding-top 10px
      .reset
        position absolute
        top 14px
        right 200px
        cursor pointer
        color #848484
        font-size 14px
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
          .table, .components
            padding 3px 12px
            border-right 1px solid #e0e0e0
            border-left 1px solid #e0e0e0
            position relative
            .icon
              cursor pointer
              line-height 29px
              img
                vertical-align text-top
            .sel-table
              top 33px
              left 0
          .font-family, .font-size, .font-headings, .text-decoration, .text-align
            border-left 1px solid #e0e0e0
            .btn
              margin 0 2px
              padding 3px 20px
          .text-decoration, .text-align
            line-height 20px
            font-size 18px
            text-decoration underline
            padding 3px 12px
            cursor pointer
            font-weight bold


</style>
