

<script type="text/jsx">
  // table组件
  import xTable from './word/table.js'
  // toolbar 组件
  import frame from './word/frame.vue'
  // immutable数据生成方法
  const {Map} = require('immutable')
  // 数据中枢 用于修改页面数据
  import dataCenter from './word/data/dataCenter'
  // document 存储了当前选择项
  import Doc from './word/core/doc'
  // 默认word页配置项
  import {NORMAL_CONFIG as normalConfig} from './word/config/baseConfig'
  // 生成默认页数据
  import {normalPage} from './word/core/core'
  // render 函数
  import {render} from './word/core/render'
  // range对象生成
  import {range as ranges} from './word/core/edit'
  // dom获取
  import {getTextNode, hasClass, prevNode, getStyle} from './word/until/dom'
  // 事件绑定
  import { bind } from './word/core/eventBind'
  // 拖拽方法
  import drag from './word/until/drag'
  // debounce
  import {debounce} from './word/until/debounce'

  let wordPit = () => {
    let NORMAL_CONFIG = normalConfig
    // 文档编辑
    let doc = new Doc();
    // 事件管理
    let eventBind;
    // 数据中枢
    let dc;
    let delay = 200
    let api = {
      //
      dc(vm) {
        return dc.bind(vm)
      },
      created() {
        this.worder = Map({m: normalPage(normalConfig)})
        dc = dataCenter(this.worder, this)
        eventBind = bind(this, doc)
      },
      // ......
      bind: function() {
        let word = document.getElementsByClassName('jfs-word')[0]
        let on = eventBind.on.bind(this)
        // doc更新方法
        let updateDoc = (e) => {
          console.log(e.target, '........\n\n\n\n\n........åßDX', ranges(), ranges().collapsed)
          let isHTMLElement = (e) => {
            return (e instanceof HTMLElement)
          }
          let r = ranges()
          // 表示选中了多个
          if(!r.collapsed) {

            let docChunk = {}
            let getAllBp = (startNode, endNode, data) => {
              let bp = []
              let sp = startNode.parentNode
              let ep = endNode.parentNode
              data.getIn(['m']).map((page, pageI) => {
                page.map((p, pi) => {

                })
              })
            }
            let inSameBp = (startNode, endNode, r) => {
              if(startNode === endNode) {
                let text = r.startContainer.textContent
                docChunk.retainsTxt = text.substr(0, r.startOffset)
                docChunk.interceptTxt = text.substr(r.startOffset, text.length)
                docChunk.selNodeAbsolutePath = startNode.dataset.id.replace(/:/g, '')
                docChunk.selNodeRelativeI = parseInt(startNode.dataset.index)
              }else {

              }
            }
            let isInSameBp = (startNode, endNode) => {
              return startNode.parentNode == endNode.parentNode
            }
            let startNode = r.startContainer.parentNode
            let startOffset = r.startOffset
            let endNode = r.endContainer.parentNode
            let endOffset = r.endOffset
            if(isInSameBp(startNode, endNode)) {
              // console.log('通过')
            }else {
              throw new Error('不通过，我们不一样')
            }

          }

          let editNode  = r.commonAncestorContainer.parentNode
          let editBp = editNode.parentNode
          if(!isHTMLElement(e)&&!hasClass(e.target, 'jfs-word')) {
            if(hasClass(editBp, 'bp_txt')) {
              doc.updateStruture(editBp, r.startOffset, r)
            }else {
              throw new Error('没选择')
            }
          }
          if(isHTMLElement(e)) {
            doc.updateStruture(e, r.startOffset, r)
          }
        }
        //
//        on(word, 'move')
        // 事件委托绑定可拖拽的icon控件
        on(word, 'mousedown', (e) => {
          let target = e.target
          // 绑定可拖拽的icon控件
          if(hasClass(target, 'icon')&&target.dataset.type === 'fillIcon') {
            let iconDrag = drag(target)
            let pos = {left: getStyle(target, 'left'), top: getStyle(target, 'top')}
            iconDrag.on('down', (el) => {
             el.style.animation = null
            })
            iconDrag.on('move', (el, {posX, posY}) => {
              el.style.left = posX+10+ 'px'
              el.style.top = posY+18+ 'px'
            })
            iconDrag.on('up', (el, {e}) => {
              el.style.left = pos.left
              el.style.top = pos.top
            })
          }
        })
        // mouseup 绑定更新doc
        on(word, 'mouseup', (e) => {
          // e.stopPropagation()
          updateDoc(e)
        })
        // 全局编辑输入事件
        on(word, 'input', debounce((e) => {
          // e.preventDefault()
          updateDoc(e)
          let n = dc.edit(e, doc, this.worder)
          this.worder = n.data
          dc.asyncDom(function(){
            let r = ranges()
            let txtNode = getTextNode(n.editNode)
            r.setStart(txtNode, n.startOffset)
            r.setEnd(txtNode, n.startOffset)
            // console.log('历史记录: ', dc.history())
          })
          }, delay, true)
        )
        // enter按下换行
        on('enter.down', (e) => {
          e.preventDefault()
          updateDoc(e)
          let n = dc.newRow(e.target, doc, this.worder)
          this.worder = n.data
          dc.asyncDom(function(){
            let txtBp = document.getElementsByClassName(n.newElClass)[0]
            let node = txtBp.childNodes[0]
            let r = ranges()
            let txtNode = getTextNode(node)
            r.setStart(txtNode, 0)
            r.setEnd(txtNode, 0)
          })
        })
        // 删除键弹起事件
        on('delete.up',(e) => {
          // e.stopPropagation()
        })
        // 删除文字
        on(word, 'delete.down',(e) =>{
          let r = ranges()
          if(!r.collapsed) return void 0
          // let
          updateDoc(e)
          debounce((e) => {
          // e.preventDefault()
          let r = ranges()
          let n = dc.deleted(e.target, doc, this.worder)
          let switchSpan = n.switchSpan&&prevNode(n.delNode)
          this.worder = n.data
          dc.asyncDom(function() {
            // 删除行
            if(n.needSelectRow) {
              r.setStart(n.prevTextNode, n.prevEndOffset)
              r.setEnd(n.prevTextNode, n.prevEndOffset)
            }
            // 删除 逻辑 主动定位光标
            if(!n.isBpBegin) {
              let node
              let start
              node = n.delNode
              start = n.deleteStart
              if(switchSpan) {
                node = switchSpan
                start = switchSpan.innerText.length
                // doc.updateStruture(node.parentNode)
              }
              let txtNode = getTextNode(node)
              r.setStart(txtNode, switchSpan ? start: start-1)
              r.setEnd(txtNode, switchSpan ? start: start-1)
              switchSpan&&updateDoc(node.parentNode)
             }
          })
        }, delay, true)(e)
        })
        // 当删除到第一个或者第二个或多个文字选择禁止默认
        on(word,'delete.down', (e) => {
          let r = ranges()
          let startOffset = r.startOffset
          if(startOffset== 1||startOffset == 0||(!r.collapsed)) {
            e.preventDefault()
          }
        })
        // 键盘按下事件，当文字是被多个选择时禁止键盘默认
        on(word, 'keydown', (e) => {
          if(!ranges().collapsed) {e.preventDefault(); return void 0}
        })
        // toolbar组件触发的生成select.table事件
        on('toolbar.select.table', (data) => {
          this.worder = dc.newTable(data, doc, this.worder, NORMAL_CONFIG)
        })

      }
    }
    return api
  }

  export default {
    name: 'app',
    data() {
      return {
        worder: null,
      }
    },
    created() {
      this.created()
     //
    },
    mounted() {
      this.bind()
    },
    components: {
      xTable,
      toolBar: frame
    },
    methods: {
      ...wordPit()
    },
    render(h) {
      return (
        <div id="app">
          <tool-bar ref='toolBar'></tool-bar>
          {
//           <x-table {...{props: { data: this.data, app: this}}}></x-table>
          }
          <div class="jfs-word">
          {this._l(this.worder.getIn(['m']), (page, pagei) => {
            return (
              <div
                class="page"
                contentEditable='true'
                data-id={pagei}
                data-type='EDIT_PAGE'
                style={{width: page.w+ 'px'}}
                ref='page'
              >
                {
                  this._l(page.m, (pm, pmi) => {
                    return render.renderByType.call(this, h, pm.t, pm, `m.:${pagei}.:m.:${pmi}`, pmi)
                  })
                }
              </div>
              )
          })}
          </div>
        </div>
      )
    }

  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  ul, li{
    list-style: none;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 0px;
  }
  .bp_txt {
    display: inline-block;
    line-height: 100%;
  }
  .bp_txt .b_txt {
    position: relative;
  }
  .bp_txt .b_txt .icon{
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin-top: -18px;
    margin-left: -10px;
    user-select: none;
    cursor: pointer;
    animation: move 0.38s;
    animation-direction:alternate;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.42,0,0.58,1)
  }
  .bp_txt .b_txt .icon img {
    width: 100%;
    height: 100%;
    user-select: none;
    pointer-events: none;
  }
  @keyframes move {
    0% {
      transform: translateY(-2px) rotateX(20deg);

    }

    100% {
      transform: translateY(2px) rotateX(20deg);
    }
  }
  .bp_txt .b_txt.active {
    border: 1px solid rgba(35,132,209, 0.25)

  }
  #app .wd-h-t{
    margin-top: 150px;
  }
  .page {
    margin: 0 auto;
    padding: 40px 80px;
    box-shadow: 1px 1px 2px #ccc;
    border: 1px solid #ccc;
  }
  * {
    outline: none;
  }
  .bot {
    width: 1px;
    height: 22px;
    background: #000;
    position: absolute;
  }
  .code-cursor {
    width: 3px;
    height: 0;
    overflow: hidden;
    position: absolute;
  }
  .code-cursor textarea {
    overflow: auto;
    resize: vertical;
    background: red;
    width: 1000px;
    height: 1em;
    border: none;

  }

</style>
