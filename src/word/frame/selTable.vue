<template lang="pug">
  div.sel-table( @mouseover='setStartPos', :style='{width: tableWidth, height: tableHeight}', ref='selTable')
    div.sel-box
      div.rows( v-for='row in boxs[0]')
        div.box( v-for='col in boxs[1]', :data-index='row+"."+col', @click='setTable')
    div.sel-menu
      span {{scale[0]}} 行 x {{scale[1]}} 列
</template>
<script>
  import {addClass, removeClass} from '../until/dom'
  import Event from '../until/event'
  let event = new Event()
  export default {
    name: 'selTable',
    data() {
      return {
        boxs: [6, 7],
        startPos: [],
        tablePos: [],
        scale: []
      }
    },
    computed: {
      tableWidth() {
        return 22*this.boxs[1]+ 'px'
      },
      tableHeight() {
        return 22*this.boxs[0]+ 8+ 'px'
      }
    },
    mounted() {
      this.setTablePos()
      event.addEvent(window.document, 'mousemove', (e) => {
        this.move(e)
      })
    },
    destroyed() {
      event.removeEvent(window.document, 'mousemove')
    },
    methods: {
      setTablePos() {
        let selTable = this.$refs['selTable']
        let rects = selTable.getBoundingClientRect()
        this.tablePos = [rects.left, rects.top]
      },
      setStartPos() {
        let selTable = document.getElementsByClassName('sel-table')[0]
        let firstBox = selTable.getElementsByClassName('box')[0]
        let rects = firstBox.getBoundingClientRect()
        this.startPos = [rects.left+2, rects.top+2]
      },
      setTable() {
        this.$emit('selTableChange', this.scale)
        // console.log(this.scale)
      },
      move(e) {
        if(this.startPos.length == 0) return
        let selTable = document.getElementsByClassName('sel-table')[0]
        let boxs = selTable.getElementsByClassName('box')
        let startPos = this.startPos
        let clientX = e.clientX
        let clientY = e.clientY
        let reverse = clientX-startPos[0]<0 ? true: false
        let activeBox = []
        let wh = (type) => {
           // 鼠标位置
          let v = type == 'width' ? clientX: clientY
          // let wOrH = type == 'width' ? 'tableWidth': 'tableHeight'
          let i = type == 'width' ? 0: 1
          // 鼠标位置到 selTable最左或上的距离
          if(v-this.tablePos[i]<=0) {
            return false
          }
          // 12指上padding或者左padding
          let wh = v-this.tablePos[i]-12
          let num = Math.ceil(Math.abs(wh/22))
          // console.log(num)
          return num
        }
        let changeBoxs = () => {
          let w = wh('width')
          let h = wh('height')
          if(typeof w === 'boolean' || typeof w === 'boolean') {
            return false
          }
          if(w>5&&w<=16) {
            this.$set(this.boxs, 1, wh('width'))
          }
          if(h>5&&h<16) {
            this.$set(this.boxs, 0, wh('height'))
          }
        }
        changeBoxs()
        let Iterator = () => {
          let packTd = (td) => {
            let rect = td.getBoundingClientRect()
            return {
              topToC: rect.top,
              leftToC: rect.left,
              rightToC: rect.left+ td.clientWidth,
              bottomToC: rect.top+ td.clientHeight,
              el: td
            }
          }

          return [...boxs].map((td) => {
            return packTd(td)
          })
        }
        let area = {
          top: reverse? clientY: startPos[1],
          left: reverse? clientX: startPos[0],
          right: reverse? startPos[0]: clientX,
          bottom: reverse? startPos[1]: clientY
        }
        // 判定区域
        let isInArea = (td) => {
          // console.log(td, area)
          return !(td.rightToC<area.left
            ||td.bottomToC<area.top
            ||td.leftToC>area.right
            ||td.topToC>area.bottom)
        }
        Iterator().map((box) => {
          if(isInArea(box)) {
            addClass(box.el, 'active')
            activeBox.push(box.el)
          }else {
            removeClass(box.el, 'active')
          }
        })
        let last = activeBox[activeBox.length-1]
        if(last) {
          this.scale = last.dataset.index.split('.')
        }
      }
    }

  }
</script>
<style lang="stylus">
  .sel-table
    padding 14px
    position absolute
    box-shadow: 0 2px 4px rgba(0,0,0,0.2)
    background #fff
    z-index 200
    cursor pointer
    .rows
      margin 0 0 8px 0
      font-size 0
      .box
        box-sizing border-box
        width 14px
        height 14px
        display inline-block
        margin-right 8px
        border 1px solid #cc
        border-radius 3px
        cursor pointer
        background rgba(35,132,209, 0)
        transition 0.55s all
        &.active
          background rgba(35,132,209, 0.25)
    .sel-menu
      text-align center
      font-size 12px
      color black
      padding-bottom 8px
</style>
