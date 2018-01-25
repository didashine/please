<template lang="pug">
  div.frame
    div.toolbar
      ul.tab-bar
        li( v-for='tool in toolbar',
          @click='active = tool.id', :class="[active == tool.id ? 'active': '']") {{tool.name}}
      h1.reset( @click='reset') 重做
      .tab
        .format-tab( v-if = 'active == 0')
          span.color
            colorPicker(v-model="normalConf.bpTxt.color", @change='colorChange')
          span.text-align(:class='[normalConf.bp.textAlign === "center"? "active": ""]', @click='bpChange(null, "textAlign")') C
          span.text-decoration(:class='[normalConf.bpTxt.textDecoration === "underline"? "active": ""]', @click='itemChange("textDecoration")') U
          down-menu.font-size( :activeId='normalConf.bpTxt.fontSize', :list='fontSize',tooltype="fontSize", :showId='true', @itemChange='itemChange')
          down-menu.font-family( :activeId='normalConf.bpTxt.fontFamily', :list='fontFamily', tooltype="fontFamily", @itemChange='itemChange')
          down-menu.font-headings( :activeId='normalConf.bp.headings', :list='headings', tooltype="headings", :prop="{id: 'name', name: 'name'}", @itemChange='bpChange')
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
  import {clearStore} from '../until/until'
  import { fontSize, headings, fontFamily, headingsConfig, NORMAL_CONFIG } from '../config/baseConfig'
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
    computed: {
      textAlignActive() {

      }
    },
    methods: {
      reset() {
        clearStore('worderData')
        location.reload()
      },
      setValue(conf) {
        if(conf['bpTxt']['heads']) {
          for(let head = 0; head< headingsConfig.length; head++) {
            let headings = headingsConfig[head]
            if(headings['name'] === conf['bp']['headings']) {
              Object.assign(conf['bpTxt'], headings['bpTxt'])
            }
          }
        }

        this.normalConf = conf
      },
      bpChange(value, tooltype) {
        if(tooltype === 'textAlign') {
          let textAlign = this.normalConf.bp['textAlign']
          this.normalConf.bp['textAlign'] = textAlign === 'left' ? 'center': 'left'
          this.$emit('select.bp', this.normalConf.bp['textAlign'], tooltype)
          return
        }
        console.log(value, tooltype)
        this.$emit('select.bp', value['name'], tooltype)

      },
      itemChange(value, tooltype) {
        console.log(value, tooltype, 'tooltype')
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
      colorChange(value) {
        this.itemChange(value, "color")
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
    background #fff
    width 100%
    padding-top 2px
    box-shadow 0 2px 4px #ccc
    z-index 30
    position relative
    .toolbar
      position relative
      padding-top 4px
      .reset
        position absolute
        top 10px
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
        padding 4px 0 4px 80px
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
            font-size 14px
            .btn
              margin 0 2px
              padding 3px 20px
          .text-decoration, .text-align, .color
            line-height 20px
            font-size 14px
            text-decoration underline
            padding 3px 12px
            cursor pointer
            font-weight bold
          .active
            background: rgba(0,0,0,.12)
            border-radius 2px
            color #333



</style>
