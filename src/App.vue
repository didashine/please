

<script type="text/jsx">
  // table组件
  import xTable from './word/table/table.js'
  // toolbar 组件
  import frame from './word/frame/frame.vue'
  import leftBar from './word/leftBar/leftBar.vue'
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
  // overflow
  import { _overflow} from './word/core/overflow'
  // range对象生成
  import {range as ranges} from './word/core/edit'
  // dom获取
  import {getTextNode, hasClass, prevNode, nextNodes, getStyle, getOffset, range} from './word/until/dom'
  // 事件绑定
  import { bind } from './word/core/eventBind'
  // 拖拽方法
  import drag from './word/until/drag'
  // debounce
  import {debounce} from './word/until/debounce'
  // store
  import {getStore, setStore} from './word/until/until'
  import './word/until/log'
  // 为表格填坑
  let fillWordToPit = () => {
    let NORMAL_CONFIG = normalConfig
    // 文档编辑
    let doc;
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
      // 更新表格模型
      updateTableModel(model) {
        doc.updateTableModel(model)
      },
      // 设置word高度
      setWordH() {
        let wordWrap = this.$refs['wordWrap']
        let documentH = document.documentElement.clientHeight
        let offsetT = getOffset(wordWrap, 'top')
        wordWrap.style.height = documentH - offsetT+ 'px'
      },
      updateToolbar (name, bI) {
        let bp = dc.getData(this.worder, name)

        let conf = {
          bpTxt: {...bp['m'][bI]['s']},
          bp: {...bp['bpStyle']}
        }
        let toolBar = this.$refs['toolBar']
        toolBar.setValue(conf)
      },
      // word初始化方法
      wordInit() {

        let worder = getStore('worderData') || {m: [normalPage(normalConfig)]}
        let data = Map(worder)
       //  this.worder = data
        doc= new Doc(this)
        eventBind = bind(this, doc)
        dc= dataCenter(data, this, eventBind)
        // console.log(data, '...')
        dc.u(data, '初始化')
      },
      // word绑定方法
      bind: function() {
        // 当前word dom
        let word = document.getElementsByClassName('jfs-word')[0]
        // 事件监听器
        let on = eventBind.on.bind(this)
        // 事件触发器
        let trigger = eventBind.trigger
        // 渲染完后设置高度
        this.$nextTick(() => {
         //  dc.commit('setH', {data: this.worder})

          // dc.setH(this.worder)
        })
        this.setWordH()
        // doc更新方法
//        let updateDoc = (e) => {
//          // 是否是dom
//          let isHTMLElement = (e) => {
//            return (e instanceof HTMLElement)
//          }
//          // 更新工具栏
//          let updateToolbar = (name, bI) => {
//            let bp = dc.getData(this.worder, name)
//            let conf = {
//              bpTxt: {...bp['m'][bI]['s']},
//              bp: {...bp}
//            }
//            let toolBar = this.$refs['toolBar']
//            toolBar.setValue(conf)
//          }
//          let r = ranges()
//          // 表示选中了多个部分
//          if(!r.collapsed) {
//            let isInSameBp = (startNode, endNode) => {
//              return startNode.parentNode == endNode.parentNode
//            }
//            let startNode = r.startContainer.parentNode
//            let endNode = r.endContainer.parentNode
//            if(isInSameBp(startNode, endNode)) {
//                let chunkDoc = {}
//                let node = startNode.parentNode
//                // console.log(node, 'nodeNum', r.startContainer)
//                let startIndex = r.startContainer.parentNode.dataset.index
//                let endIndex = r.endContainer.parentNode.dataset.index
//
//                chunkDoc = {
//                  area: [parseInt(startIndex), parseInt(endIndex)],
//                  els: [r.startContainer, r.endContainer]
//                }
//                doc.updateStruture(node, r.startOffset, r, chunkDoc)
//              return
//              }else {
//              throw new Error('不通过，我们不一样')
//            }
//
//          }
//          // 更新toolbar
//          // doc设定当前编辑bp部分
//          let editNode  = r.commonAncestorContainer.parentNode
//          let editBp = editNode.parentNode
//          if(!isHTMLElement(e)&&!hasClass(e.target, 'jfs-word')) {
//            if(hasClass(editBp, 'bp_txt')) {
//              doc.updateStruture(editBp, r.startOffset, r, e)
//              updateToolbar(doc.place.bpAbsolutePath, doc.range.editNodeRelativeI)
//            }else {
//              throw new Error('没选择')
//            }
//          }
//          if(isHTMLElement(e)) {
//            doc.updateStruture(e, r.startOffset, r)
//          }
//        }
        on('command+z', debounce((e) => {
         // this.worder = dc.Undo()
          let d = dc.Undo()
          dc.u(d, '撤回')
        }, 10, true))
        on('command+y', debounce((e) => {
         // this.worder = dc.Redo()
          dc.u(dc.Redo(), '重做')
        }, 10, true))
        // 设置word可视高度
        // 设置word高度部分
        on(window, 'resize', () => {
          this.setWordH()
        })
        // .......
        on('save', (data) => {
          console.time('save')
          setStore('worderData', data.toJS())
          console.timeEnd('save')
        })
        on('setH', (data, {node, path}) => {
          if(hasClass(node, 'word_bp')&&hasClass(node, 'bp_format')) {
            dc.commit('setBpH', {
              data,
              el: node,
              name: path
            })
          }
          // 存在于td里面的td
          if(!hasClass(node, 'word_bp')&&hasClass(node, 'bp_format')) {
            let getTr = (node) => {
              let parent = node.parentNode
              while(parent.tagName!=='TR') {
                parent = parent.parentNode
              }
              return parent
            }
            let tr = getTr(node)
            let trPath = tr.dataset.id
            data = dc['setBpH']({
              data,
              el: node,
              name: path,
              offsetH: true
            })
            dc.commit('setTr', {
              data,
              el: tr,
              name: trPath
            })
          }
          if(hasClass(node, 'word_bp')&&hasClass(node, 'table')) {
            dc.commit('setTableH', {data, el:node, path})
          }
        })
        on('beautifyPage', function(data, doc, down = true) {
          let docPath = parseInt(doc.place.docPath)
          dc.commit('autoBeautifyPage',
            {
              down,
              support: {i: docPath},
              isMerge: true,
              doc
            }).nextTick((beautifyPage) => {
            if(beautifyPage.uEditPlace.is) {
              let node = document.getElementsByClassName(beautifyPage.uEditPlace.class)[0]
              let txtNode = getTextNode(node)
              doc.rangeSet(txtNode, 0, 0, true)
            }
          })
        })
        on(word, 'paste', (e) => {
          // console.log('....', e.clipboardData.items, e)
          // e.preventBubble()
          // e.preventDefault()
          for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
            var item = e.clipboardData.items[i];
            if (item.kind === "string") {
              item.getAsString(function (str) {
                let frag = document.createDocumentFragment();
                let div = document.createElement('div');
                div.innerHTML = str
                div.id = 'clipDom'
                frag.appendChild(div);
                // str 是获取到的字符串
              })
            } else if (item.kind === "file") {
              var pasteFile = item.getAsFile();
              console.log(pasteFile, 'str')
              // pasteFile就是获取到的文件
            }
          }
        })
        // ---------------------
        // 全局click事件
        on(document, 'click', (e) => {
          e.stopPropagation()
          if(doc.tableModel&&doc.tableModel.el) {
            let table = this.$refs[doc.tableModel.el.dataset.id]
            table._initSel()
          }
          if(this.$contextMenu.cMshow) {
            this.$contextMenu.hide()
          }

        })
        // 全局contextmenu事件
        on(document,'contextmenu', (e) => {
          e.stopPropagation()
          e.preventDefault()
          this.$contextMenu.updatePos(e)
        })
        // contextmenu选择操作事件
        on('contextmenu.operation.click', (e, type) => {
          if(doc.tableModel&&doc.tableModel.el) {
            let table = this.$refs[doc.tableModel.el.dataset.id]
            table._mergeCells()
            table._cancelSelect()
          }
        })
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
          doc.updateDoc(e)
        })
        // 离开输入法时产生的事件，
        // 这个单词带有补全的意思，
        // 事件名暂时就叫complete吧
        on('complete', (e) => {
          if(doc.spellStatus !== 'originWriting') {
            doc.setSpellStatus('typeWritingEnd')
          }
        })
        // 全局编辑输入事件
        let inputDebounce = debounce(
          (e) => {
          console.log('hh')
            doc.updateDoc(e)
            //  状态为输入法状态，并且为spellStatus为普通状态
//            if(e.inputType === 'insertCompositionText'
//              &&doc.spellStatus === 'originWriting') {
//              doc.setSpellStatus('typeWriting')
//              return;
//            }
//            // 状态为输入法状态，并且为spellStatus为输入状态
//            if(e.inputType === 'insertCompositionText'
//              &&doc.spellStatus === 'typeWriting') {
//              return;
//            }
//            // 状态为输入法结束状态
//            if(doc.spellStatus === 'typeWritingEnd') {
//              doc.setSpellStatus('originWriting')
//            }
            let bpNode = doc.place.bpNode

            dc.commit('edit', {
              e,
              doc,
              data: this.worder
            }, () => {
              this.$forceUpdate()
            }).nextTick((n) => {
              let txtNode = getTextNode(doc.range.editNode)
              // console.log(txtNode, 'txtNodew')
              doc.rangeSet(txtNode, doc.startOffset, doc.startOffset)

              // trigger('beautifyPage', this.worder, doc)
            })

          }, 80, true)

        on(word, 'input', (e, flag) => {

          doc.updateDoc(e)

          let editNode = doc.range.editNode
          // 是拼音输入
          // 兼容问题除了chrome好像都没这个值
          // this.autoHeight = true;
          if(e.inputType === 'insertCompositionText'
            &&doc.spellStatus === 'originWriting') {
            doc.setSpellStatus('typeWriting')
            // this.nowrap = false

          }
          // 状态为输入法状态，并且为spellStatus为输入状态
          if(e.inputType === 'insertCompositionText'
            &&doc.spellStatus === 'typeWriting') {
            return;
          }
          // 状态为输入法结束状态
         if(doc.spellStatus === 'typeWritingEnd'||flag) {
           // this.nowrap = true
            doc.updateDoc(e)
            // this.autoHeight = false;
            doc.setSpellStatus('originWriting')
            // console.log(nextNodes(editNode), 'node')
         }
         console.time('c')
            let over = _overflow(
              editNode.parentNode,
              [editNode, ...nextNodes(editNode)],
              630)
            let data = this.worder
          // console.log(over, 'over')
            if(over['isOver']) {
            // alert('tiao')
              dc.commit(
                'auto.white.space',
                {
                  data,
                  doc,
                  over,
                  conf: undefined
                }, () => {
                  this.$forceUpdate()
                  console.timeEnd('c')
                }).nextTick((u) => {

                // 这里应该用统一的接口 doc.rangeSet的但是不知为啥没作用就先这么写
//                let node = document.getElementsByClassName(u.endBpNodePath)[0]
//                let selection = window.getSelection()
//                selection.removeAllRanges(doc.range.r)
//                let r = range(node, u.start, u.start)
//                setTimeout(() => {
//                  selection.addRange(r)
//                }, 0)
//                trigger('beautifyPage', this.worder, doc)
              })
              return void 0;
            }
           // this.nowrap = true
          //
           //  this.autoHeight = false;





          // >>>>>>>>>>>
//            let overChunks = overflow(editNode.parentNode, [editNode], 630)
//            if(overChunks.length>1) {
////              console.log(overChunks, '....')
//            }
          // <<<<<<<<<<<
//          if(e.inputType !== 'insertCompositionText') {
//            console.log('触发没')
//            let data = this.worder
//            let overChunks = overflow(editNode.parentNode, [editNode], 630)
//            if(overChunks.length) {
//              console.log('goch')
//              dc.commit(
//                'auto.white.space',
//                {
//                  data,
//                  doc,
//                  overChunks: overChunks,
//                  conf: undefined,
//                  nowrap: true
//                }, () => {
//                  console.timeEnd('calc')
//                }).nextTick((u) => {
//                let node = document.getElementsByClassName(u.endBpNodePath)[0]
//                doc.rangeSet(node, 0, 0)
//              });
//              return void 0;
//            }
//          }
          inputDebounce(e)
        }
          //debounce(
        //, 80, true)
        )
        // enter按下换行
        on('enter.down', (e, data) => {
          e.preventDefault()
          doc.updateDoc(e)
          dc.commit('newRow',
            {
              el: e.target,
              doc,
              data: this.worder,
              conf: NORMAL_CONFIG
            }).nextTick((n) => {
              if(n['data']) {
                // console.log(n, 'n')
                let txtBp = document.getElementsByClassName(n.nextLinePath)[0];

                let node = txtBp.childNodes[0]
                doc.rangeSet(node,0, 0)
                doc.updateDoc(txtBp)
                // trigger('setH', this.worder, {node: txtBp.parentNode.parentNode, path: n.nextBpPath})
                // trigger('beautifyPage', this.worder, doc)
              }
            })
          // let n = dc.newRow(e.target, doc, this.worder, NORMAL_CONFIG)
         //  this.worder = n.data
//          dc.u(n.data)
//          trigger('save', this.worder)
//          dc.asyncDom(function(){
//
//          })
        })
        // 删除文字
        // 设立一个debounce
//        let delDebounce = debounce((e) => {
//          // e.preventDefault()
//          let r = ranges()
//          let n = dc.deleted(e.target, doc, this.worder)
//          // this.worder = n.data
//          dc.u(n.data)
//          trigger('save', this.worder)
//          dc.asyncDom(function() {
//            // 删除行
//            // 删除 逻辑 主动定位光标
//            let node = n.delNode
//            let start = n.deleteStart
//            let txtNode = getTextNode(node)
//            r.setStart(txtNode, start)
//            r.setEnd(txtNode, start)
//          })
//        }, 200, true)
        on(word, 'delete.down',(e) =>{
          let r = ranges()
          if(!r.collapsed) return void 0
          // let
          doc.updateDoc(e)
          if(doc.range.startOffset == 1||doc.range.startOffset == 0) {
            if(doc.range.startOffset === 0&&+doc.range.editNodeRelativeI===0) {
              dc.commit('delete.removeRow', {
                el: e.target,
                doc,
                data: this.worder
              }).nextTick((u) => {
                if(u['data']) {
                  let node = document.getElementsByClassName(u['prevBpNodePath'])[0]
                  let sets = u['isZero'] ? 0: node.innerText.length
                  doc.rangeSet(node, sets, sets)

                  // trigger('input', e, true)
                }
              })
            }else {
              dc.commit('delete.switch', {
                el: e.target,
                doc,
                data: this.worder
              }).nextTick((u) => {
                if(u['prevNodePath']) {
                  let node = document.getElementsByClassName(u['prevNodePath'])[0]
                  let sets = node.innerText.length
                  doc.rangeSet(node, sets, sets)
                }else {
                  let node = doc.range.editTxtNode
                  doc.rangeSet(node, 0, 0)
                }
              })
            }

          }else {
            console.log('交给input')
          }
        })
        // 当删除到第一个或者第二个或多个文字选择禁止默认
        on(word,'delete.down', (e) => {
          let r = ranges()
          let startOffset = r.startOffset
          if(+doc.getTxtNodeLocation() === 0&&startOffset == 1) {
            e.preventDefault()
          }
          if(startOffset == 0||startOffset == 1||(!r.collapsed)) {
            e.preventDefault()
          }
        })
        // 键盘按下事件，当文字是被多个选择时禁止键盘默认
        on(word, 'keydown', (e) => {
          // if(!ranges().collapsed) {e.preventDefault(); return void 0}
        })
        // toolbar组件触发的生成select.table事件
        on('toolbar.select.table', (selTable) => {
          console.time('newTable')
          dc.commit('newTable', {
            selTable, doc, data: this.worder, conf: NORMAL_CONFIG
          }, () => {
            console.timeEnd('newTable')
          }).nextTick((u) => {
            let ref = u.path
            let el = this.$refs[ref].$el
            trigger('setH', this.worder, {node: el, path: u.path})
            trigger('setH', this.worder, {
              node: document.getElementsByClassName(u.bpPath)[0].parentNode.parentNode,
              path: u.bpPath
            })
            trigger('beautifyPage', this.worder, doc)
          })
        })
        on('toolbar.select.font', (value, type) => {
          // alert(JSON.stringify(this.worder.toJS()))
          NORMAL_CONFIG.bpTxt[type] = value['id'] === undefined? value: value['id']
          // console.log(NORMAL_CONFIG, 'NORMAL_CONFIG')
          // NORMAL_CONFIG.bpTxt['heads'] = false
          dc.commit('uStyle', {
            el: undefined,
            doc,
            data: this.worder,
            conf: NORMAL_CONFIG
          }).nextTick((n) => {
            let node = document.getElementsByClassName(n.newEditElClass)[0]
            let txtNode = getTextNode(node)
            doc.rangeSet(txtNode, 1, 1, true)
          })
        })
        on('toolbar.select.bp', (value, type) => {
          NORMAL_CONFIG.bp[type] = value
          dc.commit('set.bp.style', {
            doc,
            data: this.worder,
            value,
            type
          })
        })
        on('leftbar.moveblock.move', ({e}) => {
          // console.log(e.target, 'e.target')

        })
        on('leftbar.moveblock.up', ({e, currFiled}) => {
          let data = dc.fillInData(e.target, this.worder, currFiled)
          //this.worder = data
          dc.u(data)
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
        nowrap: false,
        autoHeight: false
      }
    },
    created() {
      this.wordInit()
    },
    mounted() {
      this.bind()
    },
    components: {
      xTable,
      leftBar,
      toolBar: frame
    },
    methods: {
      ...fillWordToPit()
    },
    render(h) {
      return (
        <div id="app" ref='app'>
          <tool-bar ref='toolBar'></tool-bar>
          <left-bar ref='leftBar'></left-bar>
          <div class="word-wrap"
               ref= 'wordWrap'
               style='overflow-y:scroll'

          >
            <div class="jfs-word">
              {this._l(this.worder.getIn(['m']), (page, pagei) => {
                return (
                  <div
                    ref='page'
                    class="page"
                    contentEditable='true'
                    data-id={pagei}
                    data-type='EDIT_PAGE'
                    style={{
                      width: page.w+ 'px',
                      padding: page.padding
                    }}
                  >
                    <div class="auto-h-r" style={{height: page.operateH+ 'px'}}>
                      <div contentEditable='false'>
                        <div class="bugle lt" contentEditable='false'></div>
                        <div class="bugle rt" contentEditable='false'></div>
                        <div class="bugle lb" contentEditable='false'></div>
                        <div class="bugle rb" contentEditable='false'></div>
                      </div>

                      {
                        this._l(page.m, (pm, pmi) => {
                          return render.renderByType.call(
                            this,
                            h,
                            pm.t,
                            pm,
                            `m.${pagei}.m.${pmi}`,
                            pmi,
                            false
                          )
                        })
                      }
                    </div>

                  </div>
                )
              })}
            </div>
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
  .word-wrap {
    background: url('/static/img/yang.jpeg') no-repeat 100% 100%;
    background-size: cover;
    background-position: center center;
    position: relative;
    /*background: rgb(234, 234, 234, 0.8);*/
  }
  .jfs-word {
    padding-top: 20px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

  }
  .page {
    background: rgba(255, 255, 255, 1);

    box-sizing: border-box;
  }
  .bp_format {
    border-bottom: 1px solid blueviolet;

  }
  .bp_indent {
    position: relative;
  }
  .bp_txt {
    word-break:break-all;
    display: inline-block;
    position:relative;
  }
  .bp_txt .b_txt {
    word-break:break-all;
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
  .bp_txt .b_txt:hover{
    outline: 3px solid rgba(35,132,209, 0.25)

  }
  #app .wd-h-t{
    margin-top: 150px;
  }
  .page {
    margin: 0 auto;
    box-shadow: 0px -1px 2px #ccc;
    border: 1px solid #ccc;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .auto-h-r {
    position: relative;
  }
  .bugle {
    position: absolute;
    width: 18px;
    height: 16px;
    border-right: 1px solid rgb(191,191,191);
    border-bottom: 1px solid rgb(191,191,191);
    border-radius: 2px;
  }
  .bugle.lt {
    left: -18px;
    top: -16px;
  }
  .bugle.rt {
    top:-16px;
    right: -18px;
    transform: rotateZ(90deg);
  }
  .bugle.lb {
    bottom: -16px;
    left: -18px;
    transform: rotateZ(-90deg);
  }
  .bugle.rb {
    bottom: -16px;
    right: -16px;
    transform: rotateZ(180deg);
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
