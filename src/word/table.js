import drag from './drag'
import './table.styl'
import {addClass, removeClass} from "./dom";
import Event from './event'
function getProperty (obj, name) {
  name = (name + '').split(".");
  for(var i = 0; i < name.length - 1; i++) {
    obj = obj[name[i]];
    if(typeof obj != "object" || !obj) return;
  }
  return obj[name.pop()];
};
// 对于表单的操作
let operation = function() {
  let evt_scope = Symbol('scope')
  let status = {
    // 是否处于拖拽
    inDrag: false,
    // 第几行或第几列被拖拽
    dragIndex: 0,
    // td盒子哪个位置开始(上边，下边，左边，右边)
    dragPart: 'top',
    originH: 0,
    isCtrl: false,
    // 事件作用域
    [evt_scope]: 'scope',
    // 是否处于按下状态
    down: false
  };
  // 边界对象
  let boundaryObj = {};
  // 拖拽对象
  let dragEls = {
    vel: null,
    hel: null
  }
  // 这里new一个事件对象
  let event = new Event()
  // 简单事件的封装
  !function(){
    let down = false
    let MEvt = {
      onKeyDown: function(fn) {
        event.addEvent(window.document, 'keydown', function(e) {
          fn(e.keyCode, e)
        })
      },
      onKeyUp: function(fn) {
        event.addEvent(window.document, 'keyup', function(e) {
          fn(e.keyCode, e)
        })
      }
    }
    MEvt.onKeyDown((code, e) => {
      down = true
      if(code == 16) {
        event.trigger('ctrl.down', e, down)
      }
    })
    MEvt.onKeyUp((code, e) => {
      down = false
      if(code == 16) {
        event.trigger('ctrl.up', e, down)
      }
    })
  }();
  // 获得标准的tr标签
  let getTr = function (tr) {
    let parent = tr.parentNode
    while(parent.tagName !== 'TR'&&parent.dataset.id==undefined) {
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
    bind(boundaryEl) {
      let vertical = this.$refs.vertical
      let horizontal = this.$refs.horizontal
      let on = api._on.bind(this)
      dragEls = {
        vel: vertical,
        hel: horizontal
      }
      // 边界dom，一定要首先绑定
      api._setBoundary(boundaryEl)


      // 可拖拽调节tr宽度的线拖拽事件
      api._dragLine.call(this, vertical, false)
      // 可拖拽调节tr高度的线拖拽事件
      api._dragLine.call(this, horizontal)

      // 绑定一系列事件
      // vertical单击事件
      on(vertical, 'click', (e) => {
        // console.log(e)
      })
      // horizontal单击事件
      on(horizontal, 'click', (e) => {

      })
      // 全局ctrl按下事件
      on('ctrl.down', (e) => {
        // console.log('jjj----', e)
        api.setStatus('down', true)
      })
      // 全局ctrl弹起事件
      on('ctrl.up', (e) => {
        console.log('xiugaile1')
        api.setStatus('down', false)
      })
      // 全局contextmenu事件
      on(document,'contextmenu', (e) => {
        e.stopPropagation()
        e.preventDefault()
        this.$contextMenu.updatePos(e)
      })
      // 全局click事件
      on(document, 'click', (e) => {
        this.$contextMenu.hide()
      })
      // contextmenu选择操作事件
      on('contextmenu.operation.click', (e, type) => {

      })

    },
    _mergeRow(colIndex, rows) {
      let data = this.tableRenderData.m
      data.map((tr) => {
        tr.t.map((td, i) => {

        })
      })
    },
    // args => [el/evt, evt/fn, fn/undefined]
    _on(...args) {
      let el = args[0];
      let on;
      if(typeof el === 'string') {
        let contextmenuReg = /^contextmenu\./
        if(contextmenuReg.test(el)) {
          args[0] = el.replace(contextmenuReg, '')
          on = this.$contextMenu.$on.bind(this.$contextMenu)
        }else {
          on = event.on.bind(event)
        }
      }else {
        on = event.addEvent.bind(event)
      }
      on(...args)
      // (...args) => {
      //   console.log(api.getStatus()[evt_scope] === 'scope', 'hhhh')
      //   if(!api&&!api.getStatus()[evt_scope] === 'scope') return
      //   fn(...args)
      // }
    },
    // 这里面可能有个右击事件
    _rClick() {

    },
    // 绑定边界
    _setBoundary: function(el) {
      boundaryObj = new boundary(el)
    },
    // 绑定拖拽线
    _dragLine(line, isHorizontal = true) {
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
        tableBoundary.style.userSelect = 'default'
        let data = this.tableRenderData.m
        let arith = 1
        let type = api.getStatus().dragPart
        let path = api.getStatus().dragIndex
        let move = 0
        if(isHorizontal) {
          move = args.moveY
          arith = type == 'top' ? -1: 1
          data[path].t.map((tr) => {
            let temh = tr.t_h
            if(temh == 0) {
              temh = api.getStatus()['originH']
            }
            tr.t_h = temh+ move*arith
          })
        }else {
          move = args.moveX
          arith = type == 'left' ? -1: 1
          data.map((tdobj, index) => {
            if(1) {
              let td = null
              tdobj['t'].map((td, i) => {
                if(path == i) {
                  let temh = td.t_w
                  td.t_w = temh+ move*arith
                  if(type == 'right') {
                    if(tdobj[i+1]) {
                      let temh = td.t[i].t_w
                      tdobj[i+1].t_w = temh- move*arith
                    }
                  }
                }
              })
            }

          })
        }
        api.setStatus('inDrag', false)
        line.style.left = 0+ 'px';
        line.style.top = 0+ 'px';
        line.style.display = 'none'
        el.getElementsByClassName('after')[0].style.display = 'none'
      })
    },
    cellClick: function (e) {
      e.stopPropagation()
      this.$contextMenu.hide()
      if(api.getStatus()['down']) {
        let el = e.target
        while(!/^cell/.test(el.className)) {
          el = el.parentNode
        }
        addClass(el, 'select-bg')
      }
    },
    trOnMouseMove: function(e, scope) {
      // console.log(e.target.tagName == 'TD', e.target)
      if(api.getStatus().inDrag) return;
      let vertical = this.$refs.vertical
      let horizontal = this.$refs.horizontal
      if(e.target.tagName == 'TD'&&e.target.dataset.id!==undefined) {
        let el = e.target;let index = 0;let boundObj = boundaryObj.getWirePos(e, el);
        if(boundObj.type == 'left' || boundObj.type == 'right') {
          index = scope.tdi == undefined ? el.dataset.id.slice(-1): scope.tdi
          // 左侧边缘时
          if(boundObj.type == 'left') {
            if(index>0) {
              index--
              boundObj.type = 'right'
            }
          }
          api.setStatus('dragIndex', index)
          api.setStatus('dragPart', boundObj.type)
          vertical.style.left = boundObj.x+ 'px'
          vertical.style.display = 'block'
          addClass(vertical, 'line-move-v')
        }
        if(boundObj.type == 'top' || boundObj.type == 'bottom') {
          el = getTr(e.target)
          index = scope.tri == undefined ? el.dataset.id: scope.tri
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
let renderRow = (h, hasAloneRow, render) => {
  if(hasAloneRow) {
    return (
      <td colspan="6" class="is_alone_td">
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
  name: 'xtable',
  props: {
    self: {

    },
    tableRenderData: {
    }
  },
  data() {
    return {
      operation: {}
    }
  },
  mounted() {
    let tableBoundary = this.$refs.tableBoundary
    this.bind(tableBoundary)
  },
  methods: {
    ...operation()
  },
  render() {
    return (
      <div class="table" ref='tableBoundary'>
        <div>
          <div class="line vertical-line" ref='vertical'>
            <span class="after"></span>
          </div>
          <div class="line horizontal-line" ref='horizontal'>
            <span class="after"></span>
          </div>
        </div>
        <table style={{width: '800px'}} cellPadding="0" cellSpacing="0">
          {
            this._l(this.tableRenderData.m, (tr, tri) => {
              return (
                <tr
                  data-id={`:${tri}`}
                  onMousemove={(e) => {
                    this.trOnMouseMove(e, {tri})
                  }}
                  onMouseleave={(e) => {
                    this.trOnMouseLeave(e, {tri})
                  }}
                >
                  {
                    renderRow(h, tr['has_a_r'], (
                      this._l(tr['t'], (td, i) => {
                        return (
                          <td
                            style={{height: td.t_h+ 'px', width: td.t_w-1+ 'px'}}
                              colspan={td.colspan}
                              rowspan={td.rowspan}
                              data-id={`:${tri}.:t.:${i}`}
                              onClick={(e) => {
                                if(e.target.tagName === 'TD') {
                                  let proto = e.target.dataset.id.replace(/:/g, '')
                                }
                              }}>
                            <div class="cell" style={{width: td.t_w+ 'px'}}
                              onClick={(e) => {
                                this.cellClick(e)
                              }}>
                              {
                                this._l(td['t_bp'], (bp, i)=> {
                                  return (
                                    <div class="span">
                                      <span style={
                                        {
                                          paddingRight: '20px',
                                          fontSize: bp.m.t_s+ 'px',
                                          fontFamily: bp.m.t_f}}
                                          data-id={`:${tri}.:t.:${i}.:t_bp.:${i}.:$${bp.t}`
                                          }>1可</span>
                                    </div>

                                  )
                                })
                              }
                            </div>

                          </td>
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
