<template lang="pug">
  div.hello
    atS( v-for='i in 3', ref='ats')
    div {{a}}
      div.display_lists( @click='click') clickd
    div.search( id='search')
    test
    div.test( v-j-test="")
      div
      div( v-for='is in iss.arr', @click='is.a =1') {{is.a}}

    <!--list.list.fl()-->
      <!--template( scope="props")-->
        <!--.card-->
          <!--.left_bar.priority-0( :class="[props.index%3 ? 'priority-1': 'priority-2']")-->
          <!--div.task_header-->
            <!--span.code BU4552424/-->
            <!--span 一啊激发地方3是的法师地-->
          <!--div.task_attr-->
            <!--span.task_bot 人物奉陪 0／9-->
            <!--span.task_tag.task_tag_1 偶他是短发-->
          <!--div.task_txt.text_ellipsis 大佬款发动机啊来得及法拉盛的肌肤是的法师地方-->

</template>

<script>
//import QRCode from 'qrcode'
const QRCode = require('qrcode')
import atS from './a/a.vue'
import Event from '../drag/until/event'
import Drag from '../drag/core/drag'
import list from './lists.vue'
import drop from './drop.vue'
import test from './test.vue'
const xxjf = {
  add (el, b, c) { // console.log(el, 'come from xxjf')
                    }
}

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      active: true,
      iss: {
        i: 1111,
        arr: [{a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}, {a: 6}]
      },
      a: 2323233

    }
  },
  mounted() {
    let event = new Event()
//    event.addEvent(document.body, 'click', (e, b, c) => {
////      console.log(e, b, c, this)
//      console.log('yinyinyin')
//    })
//    event.addEvent(document.body, 'click', () => {
//      //console.log('yinyinyin12323')
//    })
    //console.log(this.$refs.ats, 'ats')
    setTimeout(() => {
      //console.log('....click------')
      document.body.click()
      event.removeEvent(document.body, 'click')
      setTimeout(() => {
        //console.log('hhhhh')
        document.body.click()
      }, 2000)
    }, 10000)
    let drag = new Drag(search)
    drag.mouseDown(() => {
      console.log('mousedown')
    })
    drag.mouseUp(() => {
      console.log('mouseup')
    })
    drag.mouseMove(() => {
      console.log('mousemove')
    })
  },
  computed: {
  },
  methods: {

    click() {
      //this.iss.arr = [1,2,3,4]
      this.a = 2323
      //console.log('品质 ， 热爱生活')

    },

  },
  directives: {
    'j-test': {
      inserted() {
       // console.log('inserted')
      },
      bind: xxjf.add.bind(xxjf),
      update(a, b, c, d) {
//        console.log(a.innerHTML, 'upd')
//        console.log('update', a, b, c, d)
      },
      componentUpdated(a, b, c, d) {
//        console.log(a.innerHTML, 'com')
//        console.log('componentUpdated', a, b, c, d)
      }
    }
  },
  components: {
    atS,
    list,
    drop,
    test
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .fl
    float left
  .fr
    float right
  .text_r
    text-align right
  .search
    width 200px
    height 400px
    background blanchedalmond
  .list
    margin-right 24px
    .card
      padding 12px 15px 8px 15px
      background #fff
      position relative
      overflow hidden
      border-radius 5px
      margin-bottom 18px
      border 1px solid #dfe6ec
      cursor pointer
      .task_header
        font-size 16px
        padding-bottom 8px
        color #475669
        .code
          color #35A6F8
      .task_attr
        font-size 14px
        padding-bottom 5px
        .task_bot, .task_tag
          display inline-block
        .task_bot
          color #9FAFC4
          margin-right 18px
        .task_tag
          border-radius 5px
          padding 2px 10px
          color #fff
          &.task_tag_1
            background #E14A65
          &.task_tag_2
            background #FFD012
          &.task_tag_3
            background #939EA7
      .task_txt
         color #9FAFC4
         font-size 14px
      &:hover
        box-shadow  0 0 4px 0 rgba(0,0,0,0.10)
      .left_bar
        width 8px
        height 100%
        position absolute
        left 0
        top 0
        &.normal
          background #fff
        &.priority-0
          background #939EA7
        &.priority-2
          background #E14A65
        &.priority-1
          background #FFD012
  .task_view_item
    border-bottom 1px solid #D0D7DD
    padding-bottom 12px
  .task_label, .task_note
    display inline-block
  .task_header
    color #323C47
    position relative
    .task_code
      font-size 20px
      margin-right 16px
    .task_name
      font-size 16px
    .task_time
      margin-top 9px
      font-size 16px
  .task_other_note
    margin-top 14px
    color #9FAFC4
    .task_level
      margin-bottom 13px
      .drop_down
        position relative
        /*.select_tag:hover+ .down_menu*/
          /*display block*/
        .tag
          cursor pointer
          padding 4px 11px
          border-radius 4px
          font-size 12px
          display inline-block
          background #fff
        .task_tag_1
          color #E14A65
          border 1px solid #E14A65
        .task_tag_2
          color #FFD012
          border 1px solid #FFD012
        .task_tag_3
          color #939EA7
          border 1px solid #939EA7
        .down_menu
          width 200px
          border 1px solid #F2F5F7
          z-index 10
          box-sizing border-box
          padding 6px 0
          position absolute
          top 26px
          left 0
          background #fff
          li
            padding 6px 12px
            position relative
            &:hover
              background rgb(245, 245, 245)
            .select
              position absolute
              transform translateY(50%)
              margin-top -3px
              right 5px
  .task_label
    margin-right 25px
    .task_icon
      margin-right 11px
  .test_items
    .edit_no_allow
      cursor not-allowed
    .test_items_header
      font-size 14px
      margin 8px 0
      color #9FAFC4
      position relative
      overflow hidden
      .icon
        margin-right 12px
      .label
        margin-right 10px
      .edit
        margin-right 20px
        .btn
          color #35A6F8
          cursor pointer
          &.close
            color #FF5B79
            margin-right 8px
    .test_items_list
      position relative
      li
        overflow hidden
        border 1px solid #E9EFF4
        padding 4px 5px
        .ilb
          display inline-block
          vertical-align middle
        .checkbox
          margin-right 10px
          width 17px
        .item_meta
          width 407px
          color #989898
          font-size 12px
          padding-right 25px
          .item_name
             color #323C47
             font-size 16px
             line-height 18px
        .operation
          color #9FAFC4
          .projecter
            width 42px
          .icon
            margin-right 6px
            margin-left 9px
            display inline-block
      li.toggle
        border none
        background #EFF2F7
        padding 0 5px
        .edit
          color #9FAFC4
          text-align right
          width 646px
        .projecter
          width 42px
        .icon
          margin-right 6px
          margin-left 9px
          display inline-block
      .item_view
         border 1px solid #D3DCE6
         position absolute
         padding 15px 16px
         background #fff
         z-index 10000
         &.item_view_note
           width 321px
           box-sizing border-box
           padding 14px 10px
           border-radius 4px
           margin-left -258px
           margin-top 8px
           .tri
            position absolute
            background #fff
            border-top 1px solid #D3DCE6
            border-left 1px solid #D3DCE6
            width 6px
            height 6px
            transform rotateZ(45deg)
            top -4px
            right 42px
         &.item_view_batch_pro
           margin-left -86px
           margin-top 8px
         &.item_view_projecter
           width 179px
           box-sizing border-box
           padding 6px 10px
           color #323C47
           li
            text-align left
            padding 10px 0
            font-size 14px
            position relative
            border none
            cursor pointer
            .select
              position absolute
              transform translateY(50%)
              margin-top -3px
              right 5px


</style>
<style lang="stylus">
  .task_dialog
    .el-dialog
      width 748px
      .el-dialog__header
        .el-dialog__title
          color #9FAFC4
      .el-dialog__body
        padding-top 16px
</style>
<style lang="stylus">
  .text_ellipsis
    text-overflow ellipsis
    word-break keep-all
    white-space nowrap
    overflow hidden
  .hello
    .test_items_list
      .el-date-editor.el-input
        width 76px
        i
          display none
        input.el-input__inner
          border none
          padding 0
          width inherit
          background none


</style>
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul, li, p {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

a {
  color: #42b983;
}
.block {
  padding: 10px 15px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  border-top: 2px solid #fff;
  height: 50px;
}
.ac {

}
</style>
