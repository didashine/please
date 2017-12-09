<template lang="pug">
  .lists
    .lists_title( v-if="!title.hide")
      .fl
        span 待分派
        span {{cards.length}}
        span - {{total}}
      .fr
        el-dropdown( @command="handleCommand" )
          span.el-dropdown-link {{currentItem}}
            i.el-icon-caret-bottom.el-icon--right
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item( v-for='item in downItems', :command='item.id.toString()', :key='item.id') {{item.label}}
    slot( name="title", :total="total", :cards="cards")
    .lists_wrap
      div.first_load( v-if="firstLoad", style="z-index: 30")
        v-loading.posi
      .lists_box(
        ref="box",
        v-load-more="loadMores",
        :style="{'background': background}"
        )
        div.no_data( v-if="!cards.length")
          img( :src="noDataCss.icon")
          p {{noDataCss.txt}}
        div.bg_shade( v-show="bgShade")
        div.lists_item( v-if="cards.length")
          slot(
          :card = "card",
          v-for = "(card, index) in cards",
          :index = "index",
          :dLength = "cards.length"
          )
          transition( name="loads")
            div.load(v-if="loading")
              v-loading.posi
          div.noMore(v-if="noMore")
            span 没有更多了 &nbsp;
            i
    slot( name="footer")
</template>
<script>
  import loadMore from './loadMore.js';
  import vLoading from './Loading.vue';
  export default {
    name: 'Lists',
    mixins: [loadMore],
    data() {
      return {
        loading: false,
        noMore: false,
        //noData: false,
        firstLoad: true,
        bgShade: true,
        total: 0,
        start_no: 0,
        cards: [],
        downItems: [
          {id: 0, label: '默认排序'},
          {id: 1, label: '按截止日期'},
          {id: 2, label: '按优先级'}
        ],
        currCommand: 0
      }
    },
    created() {
      if(this.$slots.title) {
        this.title.hide = true
      }
    },
    mounted() {
      this.setHeight();
      this.getData();
      document.body.onresize = () => {
        this.setHeight()
      }
    },
    destroyed() {
      console.log('lists.component is destroyed')
      document.body.onresize = null
    },
    computed: {
      currentItem() {
        return this.downItems.filter((item, i) => {
          return item.id == this.currCommand
        })[0].label
      }
    },
    props: {
      background: {
        type: String,
        default: '#f9f9f9'
      },
      dataUrl: {
        default: '/institution/finance/pay_bill/list'
      },
      heights: {
        default: 20
      },
      title: {
        type: Object,
        default() {
          return {}
        }
      },
      protot: {
        type: String,
        default: 'data.data'
      },
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      noDataCss: {
        type: Object,
        default() {
          return {
            icon: require('./noData_Black.svg'),
            txt: '暂无任何数据'
          }
        }
      }
    },
    methods: {
      handleCommand(command) {
        this.currCommand = command
        this.refresh()
      },
      //  代理方案
      proxy(method) {
        let args = [].slice.call(arguments, 0);
        method = args.shift();
        if(this[method] === undefined ) {
          throw new Error(`Property or method ${method} is not definedon
          the instance but referenced during render.`);
          return;
        };
        let filterTip = (methods,fn) => {
          if(!methods) {
            return;
          }
          this.has(method, methods) && fn.call(this);
        };
        filterTip();
        this[method].apply(this, args);
      },
      has(method,methods) {
        let has = false;
        for(let i = 0; i < methods.length; i++) {
          if(method = methods[i]) {
            has = true;
            break;
          }
        }
        return has;
      },
      setHeight() {
        let getOffset = (obj,type) => {
          type = (type === 'left') ? 'offsetLeft' : 'offsetTop'
          let l = obj[type]; // 对应父容器的上边距
          while (obj = obj.offsetParent) {
            l += obj[type];
          }
          return parseInt(l)
        };
        let getPadding = (obj) => {
          let sty =  obj.currentStyle ? obj.currentStyle['padding']:
            getComputedStyle(obj, false)['padding'];
          sty = sty.split(' ').map((arr, i) => {
            return parseInt(arr);
          });
          return {
            paddingTop: sty[0],
            paddingRight: sty[1],
            paddingBottom: sty[2],
            paddingLeft: sty[3]
          }
        }
        let box = this.$refs.box;
        let wHeight = document.documentElement.clientHeight;
        this.$nextTick(() => {
          // 256
          let padding = getPadding(box);
          let paddingTB = padding.paddingTop + padding.paddingBottom;
          let offsetTop = getOffset(box, 'offsetTop');
          let allH = paddingTB + offsetTop;
          box.style.height = wHeight - allH - this.heights + 'px';
        })

      },
      getData() {
        let defaultParmas = {
          start_no: this.start_no || 0,
          size: this.firstLoad? 12: 8,
          type: this.currCommand
        }
        let url = ''
        console.log(defaultParmas)
        let setData = (res) => {
          let data = this.getProperty(res, this.protot)
          Array.prototype.push.apply(this.cards, data.data)
          this.$emit('onloaded', this.cards, this.firstLoad)
          // 当数据是第一次获取时发生的情况
          if(this.firstLoad) {
            this.firstLoad = false;
            // 纪录总条数
            this.total = data.count;
          }
          this.start_no = this.start_no + data.data.length;
          //return Promise.resolve(res)
        }
        /* 模拟调试 */
        let d = (num) => {
          let obj = []
          for(let i =0;i< num; i++) {
            obj.push({a: 2222, b: 33333, t: new Date()})
          }
          return obj
        }
        return new Promise((resolve, reject) => {
          let random = Math.random()*800*1
          setTimeout(() => {
            let loadData = () => {
              if(this.cards.length> Math.random()*800) {
                return d(0)
              }
              return this.firstLoad ? d(14) : d(5)
            }
            let res = {data: {data: {data: loadData(), count: 100}}}
            setData(res)
            resolve(res)
          }, random)
        })

        /* 真实 */
//        Object.assign(defaultParmas, this.params)
//        this.$http.get(this.dataUrl, defaultParmas).then((res) => {
//          setData(res)
//          return Promise.resolve(res)
//        }).catch((err) => {
//          err.data.message && this.$message.error(err.data.message);
//          return Promise.reject(err)
//        })
      },
      init() {
        this.noMore = false;
        this.firstLoad = true;
        //this.noData = false;
        this.start_no = 0;
        this.cards = [];
      },
      refresh() {
        this.init();
        this.getData()
      },
      loadMores(next, up) {
        // 当没有更多数据时不再发生任何请求
        if(this.noMore) {
          next();
          return;
        }
        // 当向上加载时发生的情况，该栏目无此功能，但是必须执行next
        if(up) {
          next();
          return;
        }
        // 去除遮罩并且加载开始
        this.bgShade = false;
        this.loading = true;
        this.getData().then(_ => {
          let data = this.getProperty(_, this.protot)
          //  当没有更多数据时
          if(data.data.length == 0) {
            next();
            this.noMore = true;
            this.loading = false;
            return;
          }
          // 当还有数据时，等div已经构建(即this.$nextTick)在next(),防止产生重复请求
          this.loading = false;
          this.$nextTick(() => {
            this.bgShade = true;
            next();
          })
        }).catch((err) => {
          err.data.message && this.$message.error(err.data.message);
        })
      },
      getProperty (obj, name) {
        name = (name + '').split(".");
        for(var i = 0; i < name.length - 1; i++) {
          obj = obj[name[i]];
          if(typeof obj != "object" || !obj) return;
        }
        return obj[name.pop()];
      },
      setProperty (obj, name, value) {
        name = (name + '').split(".");
        for(var i = 0; i < name.length - 1; i++) {
          if(typeof (obj[name[i]]) !== "object" || !obj[name[i]]) obj[name[i]] = {};
          obj = obj[name[i]];
        }
        obj[name.pop()] = value;
      },
      // 数据操作，对外暴露数据
      JsBean () {
        let __this = this;
        return {
          getCards (name) {
            return __this.getProperty( __this.cards, name);
          },
          setCards (name, value) {
            __this.setProperty( __this.cards, name, value);
          }
        }
      }
    },
    components: {
      vLoading
    }
  }
</script>
<style lang="stylus" scoped>
  .fl
    float left
  .fr
    float right
  .lists
    width 350px
    box-shadow 0 0 4px 0 rgba(0,0,0,0.14)
    position relative
    .first_load
      width 100%
      height 100%
      position absolute
      background #f9f9f9
      .posi
        top 40px
        left 50%
        transform translateX(-50%)
    .lists_title
      width 100%
      margin 0 auto
      height 47px
      box-sizing border-box
      padding 14px 16px 13px 16px
      font-size 14px
      line-height 20px
      border 1px solid rgba(0,0,0,0.10)
      .fl
        color #9fafc4
        span
          font-size 18px
          padding-right 8px
          color #323c47
      .fr
        padding-top 2px
    .lists_wrap
      position relative
      .lists_box
        padding 24px 16px 0 16px
        background #f9f9f9
        overflow auto
        .bg_shade
          position absolute
          z-index 4
          transition all 0.5s
          background linear-gradient(180deg,hsla(0,0%,100%,0),#fff)
          height 50px
          width 100%
          box-sizing border-box
          margin 0 auto
          bottom 1px
          left 0
        .no_data
          padding-top 97px
          text-align center
          color #989898
          font-size 16px
          p
            font-size 16px
            padding-top 11px
            line-height 28px
        .lists_item
          .load
            clear both
            height 55px
            position relative
            box-shadow 0px 13px 5px -14px #ccc
            .posi
              left 50%
              top 50%
              transform translateX(-50%) translateY(-60%)
          .loads-enter,.loads-leave-active
            height 0
            opacity 0
          .loads-enter-active,.loads-leave-active
            transition-duration 0.8s
            transition-property all
            transition-timing-function ease-out
          .noMore
            clear both
            height 70px
            box-sizing border-box
            padding-top 8px
            text-align center
            span
              color #A6A6A6
              font-size 14px
            i
              display inline-block
              width 12px
              height 12px
              background #A6A6A6
              border-radius 50%
</style>
