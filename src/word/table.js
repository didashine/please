import './table.styl'
import drag from './until/drag'
import {addClass, removeClass} from "./until/dom";
// import Event from './until/event'
import { once } from './until/until'
import code from './core/code'
import {bind} from "./core/eventBind";
import {render} from "./core/render";
import {splice, getMutable, replace, setProperty, getProperty, mined, push} from "./data/immutable";

// function setProperty (obj, name, value) {
//   name = (name + '').split(".");
//   for(var i = 0; i < name.length - 1; i++) {
//     if(typeof (obj[name[i]]) !== "object" || !obj[name[i]]) obj[name[i]] = {};
//     obj = obj[name[i]];
//   }
//   obj[name.pop()] = value;
// };

// 时间旅行者， 可以在几个版本里面穿梭，简单点讲就是撤回，逆撤回
function timeTraveler(size=100) {
 let history = []
 let version = 0
 let api = {
   // 撤回
   Undo() {
     version = version <= 1 ? 0 : --version
     return history[version]['v']
   },
   // 逆撤回
   Redo() {
     version = version>= (history.length-2) ? history.length-1: ++version
     return history[version]['v']
   },
   record(v) {
     let length = history.push({v, t: new Date()})
     version= --length
     if(length>size) {
       history.shift()
       version <= 1 ? 0 : version--
     }
   }
 }
 return api
}
// 对于表单的操作
let operation = function() {
  let evt_scope = Symbol('scope')
  let status = {
    // 是否处于拖拽
    inDrag: false,
    // 第几行或第几列被拖拽
    dragIndex: 0,
    rowIndex: 0,
    // td盒子哪个位置开始(上边，下边，左边，右边)
    dragPart: 'top',
    // 需要合并的行 ps 不再需要 先不删除
    mergeRow: [],
    // 需要合并的列 ps 不再需要 先不删除
    mergeCol: [],
    /* 单元格矩阵 ps: 这可能👀起来是个三维的数组矩阵，但其实是二维的
    * cellMatrix:
    * [
    *   [[1, 0], [2, 0]],
    *   [[1, 1], [2 ,1]]
    * ]
    *
    */
    cellMatrix: [],
    originH: 0,
    isCtrl: false,
    // 事件作用域
    [evt_scope]: 'scope',
    // 是否处于按下状态
    down: false,
    // 是否处于选择状态
    inSelect: false
  };
  // code
  let codeE = code()
  // 版本回退
  let history = timeTraveler(12)
  // 这里等待接管数据中心 wating
  // 边界对象
  let boundaryObj = {};
  // 拖拽对象
  let dragEls = {
    vel: null,
    hel: null
  }

  // 简单事件的封装
  // !function(){
  //   let down = false
  //   let MEvt = {
  //     onKeyDown: function(fn) {
  //       event.addEvent(window.document, 'keydown', function(e) {
  //         fn(e.keyCode, e)
  //       })
  //     },
  //     onKeyUp: function(fn) {
  //       event.addEvent(window.document, 'keyup', function(e) {
  //         fn(e.keyCode, e)
  //       })
  //     }
  //   }
  //   MEvt.onKeyDown((code, e) => {
  //     down = true
  //     if(code == 16) {
  //       event.trigger('ctrl.down', e, down)
  //     }
  //   })
  //   MEvt.onKeyUp((code, e) => {
  //     down = false
  //     if(code == 16) {
  //       event.trigger('ctrl.up', e, down)
  //     }
  //   })
  //   // command 91 shift 16 z 90
  //   MEvt.onKeyDown((code) => {
  //     down = true
  //     if (code == 91) {
  //       MEvt.onKeyDown((code, e) => {
  //         if(code == 90) {
  //           event.trigger('command+z', e, down)
  //         }
  //       })
  //
  //     }
  //   })
  // }();
  // 获得标准的tr标签

  let getTr = function (tr) {
    let parent = tr.parentNode
    while(parent.tagName !== 'TR'&&parent.dataset.index==undefined) {
      parent = parent.parentNode
    }
    return parent
  }
  // api 内外api _method 不对外 method 对外暴露
  let api =  {

    getStatus() {
      return status
    },
    setStatus(name, value) {
      status[name] = value
    },
    created() {
      // this.$parent.dc(this)
    },
    bind(boundaryEl) {
      let eventManger  = bind(this)
      let vertical = this.$refs.vertical
      let horizontal = this.$refs.horizontal
      let on = eventManger.on.bind(this)
      dragEls = {
        vel: vertical,
        hel: horizontal
      }
      // 记录原始版本
      history.record(this.tableRenderData)

      // 边界dom，一定要首先绑定
      api._setBoundary(boundaryEl)

      // 调节tr宽度的线拖拽bind
      api._dragLine.call(this, vertical, false)
      // 调节tr高度的线拖拽bind
      api._dragLine.call(this, horizontal)
      // 表格可选择单元格bind
      api._dragTable.call(this, boundaryEl)
      // 绑定一系列事件
      // vertical单击事件
      on(vertical, 'click', (e) => {
        e.stopPropagation()
      })
      // horizontal单击事件
      on(horizontal, 'click', (e) => {
        e.stopPropagation()
      })
      on(vertical, 'mousedown', (e) => {
        e.stopPropagation()
      })
      // horizontal单击事件
      on(horizontal, 'mousedown', (e) => {
        e.stopPropagation()
      })
      // 全局ctrl按下事件
      on('ctrl.down', (e) => {
        api.setStatus('down', true)
      })
      // 全局ctrl弹起事件
      on('ctrl.up', (e) => {
        api.setStatus('down', false)
      })
      on(boundaryEl, 'click', (e) => {
        if(api.getStatus('inSelect')) {
          e.stopPropagation()
        }
      })
      // command 91 shift 16 z 90
      // debounce command+z 命令按键

      // on('command+shift+z', debounce((e) => {
      //   this.tableRenderData = history.Redo()
      // }, 200, true))

    },
    // args => [el/evt, evt/fn, fn/undefined]
    // _on(...args) {
    //   let el = args[0];
    //   let on;
    //   if(typeof el === 'string') {
    //     let contextmenuReg = /^contextmenu\./
    //     // contextMenu组件的事件
    //     if(contextmenuReg.test(el)) {
    //       args[0] = el.replace(contextmenuReg, '')
    //       on = this.$contextMenu.$on.bind(this.$contextMenu)
    //     }else {
    //       // 普通自定义事件
    //       on = event.on.bind(event)
    //     }
    //   }else {
    //     // dom事件
    //     on = event.addEvent.bind(event)
    //   }
    //   on(...args)
    // },
    //
    _initSel() {
      if(!api.getStatus()['inSelect']) {
        this._cancelSelect()
        api.setStatus('cellMatrix', [])
        this.app.updateTableModel(null)
        // api.setStatus('mergeRow', [])
        // api.setStatus('mergeCol', [])
      }
    },
    // 合并单元格
    _mergeCells() {
      let word = this.$refs.tableBoundary
      let path = word.dataset.id
      let data = this.app.worder
      let renderData = this.renderData
      let cellMatrix = api.getStatus()['cellMatrix']
      let start = { y: cellMatrix[0][0][1], x: cellMatrix[0][0][0]}
      let end = { y: cellMatrix.slice(-1)[0][0][1], x: cellMatrix.slice(-1)[0].slice(-1)[0][0]}
      let w = 0
      let h = 0
      for(let i=start.y; i<=end.y; i++) {
        for(let j = start.x; j<=cellMatrix.slice(0)[0].slice(-1)[0][0]; j++) {
          if(i==start.y)  {
            let tempw = getMutable(renderData, `m.${i}.td.${j}.t_w`)
            w+=tempw
          }
          if(j==start.x) {
            let temph = getMutable(renderData, `m.${i}.td.${j}.t_h`)
            h+=temph
          }
        }
      }
      // 对矩阵进行  行(tr标签) 遍历
      for(let i = 0; i< cellMatrix.length; i++) {
        // 拿到当前行的td盒子坐标，详细查询cellMatrix矩阵结构，见变量定义注释
        let row = cellMatrix[i][0][1]
        let begin = 0
        let num = 0
        if(i=== 0) {
          begin = +cellMatrix[i][0][0]+1
          num = cellMatrix[i].length-1
        }else {
          begin = cellMatrix[i][0][0]
          num = cellMatrix[i].length
        }
        // 存储移除掉的td的原始位置
        let addNum = getProperty(data, `${path}.m.${row}.destroy`).length
        let destroyIndex = []
        for(let n = 0;n<num;n++) {
          destroyIndex.push(parseInt(begin)+n+ addNum);
        }
        destroyIndex = destroyIndex.length<=1 ? destroyIndex: [destroyIndex]
        data = push(data, `${path}.m.${row}.destroy`, ...destroyIndex)
        // data = splice(data,`${path}.m.${row}.td`,  begin, num)
        //let otherTr = dat
        //

        data = setProperty(
          data,
          `${path}.m.${row}.td.${+cellMatrix[i][0][0]}.merge`,
          {
            colspan: cellMatrix[0].length,
            rowspan: cellMatrix.length- i,
            isMerge: true
          })
        let rs = num+ (+begin);
        for(;begin< rs;begin++) {
          // 把不需要显示的td设置为false
          data = setProperty(data, `${path}.m.${row}.td.${begin}.show`, false)
        }
      }
      data = setProperty(data, `${path}.m.${start.y}.td.${start.x}.colspan`, cellMatrix[0].length)
      data = setProperty(data, `${path}.m.${start.y}.td.${start.x}.rowspan`, cellMatrix.length)
      data = setProperty(data, `${path}.m.${start.y}.td.${start.x}.t_w`, w)
      data = setProperty(data, `${path}.m.${start.y}.td.${start.x}.t_h`, h)

      this.app.worder = data
      history.record(data)
      api.setStatus('cellMatrix', [])
    },
    _cancelSelect() {
      let data =this.renderData.m
      let tableRenderData = this.app.worder
      let dataId = this.dataId
      data.map((tr, index) => {
        tr.td.map((td, i) => {
          tableRenderData = setProperty(tableRenderData, `${dataId}.m.${index}.td.${i}.t_s`, false)
        })
      })
      this.app.worder = tableRenderData
    },
    // 这里面可能有个右击事件
    _rClick() {

    },
    // 绑定边界
    _setBoundary: function(el) {
      boundaryObj = new boundary(el)
    },
    // 筛选bind
    _dragTable(table) {
      let tableRenderData;
      let dragTable = drag(table)
      let Iterator = () => {
        let packTd = (td) => {
          let rect = td.getBoundingClientRect()
          return {
            topToC: rect.top,
            leftToC: rect.left,
            rightToC: rect.left+ td.clientWidth,
            bottomToC: rect.top+ td.clientHeight,
            el: td,
            proto: td.dataset.id
          }
        }
        let tds = table.querySelectorAll('td[data-id]')
        return [...tds].map((td) => {
          return packTd(td)
        })
      }
      let allTds = [];
      dragTable.on('down', (el, {e}) => {
       this.app.updateTableModel({el})
       tableRenderData = this.app.worder
       // e.stopPropagation()
       allTds = Iterator()
       api.setStatus('inSelect', true)
      })
      dragTable.on('move', (el, {originX, originY, currentX, currentY}) => {
        let reverse = currentX-originX<0 ? true: false
        let area = {
          topToC: reverse? currentY: originY,
          leftToC: reverse? currentX: originX,
          rightToC: reverse? originX: currentX,
          bottomToC: reverse? originY: currentY
        }
        // 判定区域
        let isInArea = (td) => {
          return !(td.rightToC<area.leftToC
            ||td.bottomToC<area.topToC
            ||td.leftToC>area.rightToC
            ||td.topToC>area.bottomToC)
        }
        allTds.map((td) => {
          if(isInArea(td)) {
            td.is = true
            tableRenderData = setProperty(tableRenderData, td.proto+'.t_s', true)
          }else {
            td.is = false
            tableRenderData = setProperty(tableRenderData, td.proto+'.t_s', false)
          }
        })
        this.app.worder = tableRenderData
        // this.tableRenderData = tableRenderData
      })
      dragTable.on('up', (el, {e}) => {
        // let rows = api.getStatus()['mergeRow']
        // let cols = api.getStatus()['mergeCol']
        let cellMatrix = api.getStatus()['cellMatrix']
        let reg = /(\d+)/g
        let matrix = []
        let prevY = -1

        allTds.map((td) => {
          if(td.is) {
            let coordinate = td.proto.match(reg).reverse()
            if(prevY!==coordinate[1]) {
              matrix = []
              cellMatrix.push(matrix)
              prevY = coordinate[1]
            }
            matrix.push(coordinate)
          }
        })
        this.app.updateTableModel({el, cellMatrix})
        api.setStatus('cellMatrix', cellMatrix)
        api.setStatus('inSelect', false)
      })
    },
    // 绑定拖拽线
    _dragLine(line, isHorizontal = true) {
      return;
      let tableBoundary = boundaryObj.el
      let dragLine = drag(line)
      dragLine.on('down',(el, args) => {
        tableBoundary.style.userSelect = 'none'
        api.setStatus('inDrag', true)
        el.getElementsByClassName('after')[0].style.display = 'block'
      })
      dragLine.on('move', (el, args) => {
        if(isHorizontal) {
          el.style.top = args.posY+ 'px'
        }else {
          el.style.left = args.posX+ 'px'
        }
      })
      dragLine.on('up', (el, args) =>  {
        let inDrag = api.getStatus().inDrag
        if(!inDrag) return;
        // ......
        tableBoundary.style.userSelect = 'default'
        let data = getIn(this.tableRenderData, ['m'])
        let tableRenderData = this.tableRenderData
        let type = api.getStatus().dragPart
        let path = api.getStatus().dragIndex
        let move = 0
        let arith = 1
        if(isHorizontal) {
          move = args.moveY
          arith = type == 'top' ? -1: 1
          data[path].t.map((tr, i) => {
            let temh = tr.t_h
            if(temh == 0) {
              temh = api.getStatus()['originH']
            }
            tableRenderData = setProperty(tableRenderData, `m.${path}.td.${i}.t_h`, temh+ move*arith)
            // tr.t_h = temh+ move*arith
          })
        }else {
          move = args.moveX
          arith = type == 'left' ? -1: 1
          // 改变行公共方法
          let changeCol = (tdObj, index, isAlone) => {
            // if(isAlone) {
            //   let temh = getProperty(data, `m.${index}.t.${path}.t_w`)
            //   endValue = setProperty(data, `m.${index}.t.${path}.t_w`, temh + move * arith)
            //   if(type == 'right'&&path<tdObj.col_l-1){
            //     let tempI = path
            //     let temh = getProperty(data, `m.${index}.t.${++tempI}.t_w`)
            //     endValue = setProperty(data, `m.${index}.t.${tempI}.t_w`, temh - move * arith)
            //   }
            //   return;
            // }else {
              tdObj['t'].map((td, i) => {
                if (path == i) {
                  let temh = td.t_w
                  tableRenderData = setProperty(tableRenderData, `m.${index}.td.${i}.t_w`, temh + move * arith)
                  // 如果是非第一个的单元格
                  if (type == 'right'&&i<tdObj.col_l-1) {
                    let temh = getProperty(data, `m.${index}.t.${++i}.t_w`)
                    tableRenderData = setProperty(tableRenderData, `m.${index}.td.${i}.t_w`, temh - move * arith)
                  }
                }
              })
            // }
          }
          // 处理是否再选中情况下的
          if(api.getStatus()['mergeCol'].length==0) {
            let currentRowI = api.getStatus()['rowIndex']
            // let currentRow = getProperty(data,`m.${currentRowI}` )
            // if(currentRow.has_a_r) {
            //   changeCol(currentRow, currentRowI, true)
            // }else {
            data.map((tdobj, index) => {
              changeCol(tdobj, index)
            })
            // }
          }else {
            // 是否选中
            // let rows = api.getStatus()['mergeRow']
            // for(let i =0; i< rows.length; i++) {
            //   endValue = setProperty(data,`m.${rows[i]}.has_a_r`, true)
            //   this.$nextTick(() => {
            //     data['m'].map((tdobj, index) => {
            //       if(rows.indexOf(index) >=0) {
            //         changeCol(tdobj, index, true)
            //       }
            //     })
            //   })
            // }
          }
        }
        api.setStatus('inDrag', false)
        line.style.left = 0+ 'px';
        line.style.top = 0+ 'px';
        line.style.display = 'none'
        el.getElementsByClassName('after')[0].style.display = 'none'
        history.record(tableRenderData)
        this.tableRenderData = tableRenderData
      })


    },
    _storeCell(i) {

    },
    code: function (e, proto) {
      codeE.newLine.call(this, e, e.target, proto)
    },
    cellClick: function (e, {proto, tri, tdi}) {
      if(1) return; // 暂时不用
      let data = this.tableRenderData.m
      this.$contextMenu.hide()
      if(api.getStatus()['down']) {
        let el = e.target
        while(!/^cell/.test(el.className)) {
          el = el.parentNode
        }
        //  存
        let rows = api.getStatus()['mergeRow']
        let cols = api.getStatus()['mergeCol']
        if(rows.length >0) {
          let rowi = rows[mined(rows)]
          let coli = cols[mined(cols)]
          for(let i =rowi;i<=tri;i++) {
            for(let j =coli;j<=tdi;j++) {
              if(rows.indexOf(i) === -1) {
                rows.push(i)
              }
              if(cols.indexOf(j) === -1) {
                cols.push(j)
              }
              setProperty(data, `${i}.t.${j}.t_s`, true)
            }
          }
        }else {
          rows.push(tri)
          cols.push(tdi)
          setProperty(data, proto+'.t_s', true)
        }
        api.setStatus('mergeRow', rows)
        api.setStatus('mergeCol', cols)
        // addClass(el, 'select-bg')
      }
    },
    trOnMouseMove: function(e, scope) {
      return;
      if(api.getStatus().inDrag) return;
      let vertical = this.$refs.vertical
      let horizontal = this.$refs.horizontal
      if(e.target.tagName == 'TD'&&e.target.dataset.index!==undefined) {
        let el = e.target;let index = 0;let boundObj = boundaryObj.getWirePos(e, el);
        if(boundObj.type == 'left' || boundObj.type == 'right') {
          index = scope.tdi == undefined ? el.dataset.index.slice(-1): scope.tdi
          // 左侧边缘时
          if(boundObj.type == 'left') {
            if(index>0) {
              index--
              boundObj.type = 'right'
            }
          }
          api.setStatus('rowIndex', scope.tri)
          api.setStatus('dragIndex', index)
          api.setStatus('dragPart', boundObj.type)
          vertical.style.left = boundObj.x+ 'px'
          vertical.style.display = 'block'
          addClass(vertical, 'line-move-v')
        }
        if(boundObj.type == 'top' || boundObj.type == 'bottom') {
          el = getTr(e.target)
          index = scope.tri == undefined ? el.dataset.index: scope.tri
          boundObj = boundaryObj.getWirePos(e, el)
          // 上边缘时
          if(boundObj.type == 'top') {
            if(index>0) {
              index--
              boundObj.type = 'bottom'
            }
          }
          api.setStatus('originH', el.clientHeight)
          api.setStatus('dragIndex', index)
          api.setStatus('dragPart', boundObj.type)
          horizontal.style.top = boundObj.y+ 'px'
          horizontal.style.display = 'block'
          addClass(horizontal, 'line-move-h')
        }
      }
    },
    trOnMouseLeave: function(e, scope) {
      return;
      if(api.getStatus().inDrag) return;
      // let vertical = this.$refs.vertical
      // let horizontal = this.$refs.horizontal
      //removeClass(vertical, 'line-move-v')
      // removeClass(horizontal, 'line-move-h')
    }
  }

  return api
}
// 边界判定对象
class boundary{
  constructor(tableBoundary) {
    this.el = tableBoundary
    this.pos = {
      x: 0,
      y: 0,
      top: this._getOffset(tableBoundary, 'top'),
      left: this._getOffset(tableBoundary, 'left')
    }
  }
  _getOffset (obj,type) {
    type = (type === 'left') ? 'offsetLeft' : 'offsetTop'
    let l = obj[type]; // 对应父容器的上边距
    while (obj = obj.offsetParent) {
      l += obj[type];
    }
    return parseInt(l)
  }
  _inEdge(el) {
    let pos = this.pos
    let rect = el.getBoundingClientRect()
    // 外层表格距离窗口距离
    let tfromClientY = pos.top -document.documentElement.scrollTop
    let tfromClientX = pos.left -document.documentElement.scrollLeft
    let areaT = 2
    let areaB = -1
    if(areaB<(pos.y-rect.top)&& (pos.y-rect.top)<=areaT) {
      return {
        type: 'top',
        y: rect.top - tfromClientY-1,
        //y: pos.y+document.documentElement.scrollTop-pos.top-2,
        x: 0
      }
    }
    if(areaB<=pos.y-(rect.top+el.clientHeight)&& pos.y-(rect.top+el.clientHeight)<=areaT) {
      return {
        type: 'bottom',
        y: rect.top+ el.clientHeight - tfromClientY,
        x: 0
      }
    }
    if(areaB<pos.x-rect.left&& pos.x-rect.left<=areaT) {
      return {
        type: 'left',
        x: rect.left-tfromClientX-1,
        y: 0
      }
    }
    if(areaB<=pos.x-(rect.left+el.clientWidth)&& pos.x-(rect.left+el.clientWidth)<=areaT) {
      return {
        type: 'right',
        x: rect.left+ el.clientWidth -tfromClientX,
        y: 0
      }
    }
    return false
  }
  _updateXY(e) {
    this.pos.x = e.clientX
    this.pos.y = e.clientY
  }
  getWirePos(e, el) {
    this._updateXY(e)
    return this._inEdge(el)
  }
}
// render特定的table
let renderRow = (h, AloneRow, render) => {
  if(AloneRow.has_a_r) {
    return (
      <td colspan={AloneRow.col_l} class="is_alone_td">
        <table class="is_alone_row" cellPadding="0" cellSpacing="0">
          <tr>
            {
              render
            }
          </tr>
        </table>
      </td>
    )
  }else {
    return render
  }
}
export default {
  name: 'xTable',
  props: {
    app: {

    },
    dataId: {
      type: String
    },
    renderData: {

    }
  },
  data() {
    return {
      // renderData: {},
      // xx: 'dogjin'
    }
  },
  created() {
    // this.$options.components
    // this.$options.components.xTable = require('./table')
  },
  mounted() {
    let tableBoundary = this.$refs.tableBoundary
    this.bind(tableBoundary)
  },
  methods: {
    ...operation(),
  },
  render() {
    return (
      <div  contentEditable='false' class="table" data-id={this.dataId}  ref='tableBoundary' style={{width: this.renderData.w}}>
        <div>
          <div class="line vertical-line" ref='vertical'>
            <span class="after"></span>
          </div>
          <div class="line horizontal-line" ref='horizontal'>
            <span class="after"></span>
          </div>
        </div>
        <table style={{width: this.renderData.w}} cellPadding="0" cellSpacing="0">
          {
            this._l(this.renderData.m, (tr, tri) => {
              return (
                <tr
                  data-index={`:${tri}`}
                  data-id={`${this.dataId}.m.${tri}`}
                  onMousemove={(e) => {
                    this.trOnMouseMove(e, {tri})
                  }}
                  onMouseleave={(e) => {
                    this.trOnMouseLeave(e, {tri})
                  }}
                >
                  {
                    renderRow(h, tr, (
                      this._l(tr['td'], (td, i) => {
                        return (
                          td['show']?
                          <td
                            style={{height: td.t_h+ 'px', width: td.t_w-3+ 'px'}}
                              colspan={td.colspan}
                              rowspan={td.rowspan}
                              data-id={`${this.dataId}.m.${tri}.td.${i}`}
                              data-key={td.i}
                              ref={i}

                          >
                            <div
                              class={td.t_s ? 'cell select-bg': 'cell'}
                              style={{width: td.t_w-3+ 'px'}}
                              contentEditable={true}
                              onClick={(e) => {
                              }}
                              onInput={(e) => {

                              }}
                            >
                              {
                                this._l(td['t_bp'], (bp, bpi)=> {
                                  return (
                                    render.renderByType.call(this.$parent, h, bp.t, bp, `${this.dataId}.m.${tri}.td.${i}.t_bp.${bpi}`, bpi, true)
                                  )
                                })
                              }
                            </div>
                          </td>: null
                        )
                      })
                    ))
                  }
                </tr>
              )
            })
          }
        </table>
      </div>)

  }

}
