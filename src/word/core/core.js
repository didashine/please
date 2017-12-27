import event from './event'
// 键盘控制
// bind全局
let keyContrl = {
  _evt: !function() {
    let evt = new event(document)
    return evt
  }(),
  keyUp(keyCode, fn) {
    keyContrl._evt.addEvent('keyup', function(e) {
      if(e.keyCode == keyCode) {
        fn&&fn(e)
      }
    })
  },
  // 38
  up(fn) {
    keyContrl.keyUp(38, function(e) {
      fn&&fn(e)
    })
  },
  // 8
  delete(fn) {
    keyContrl.keyUp(8, function(e) {
      fn&&fn(e)
    })
  },
  // 16
  entry() {
    keyContrl.keyUp(16, function(e) {

    })
  }
}
// 重构数据模型
class vDModel {
  constructor(vm) {
    this.vModel = vm
    this._kc = keyContrl
    if(!this.vModel.wordModel) {
      throw new Error('请定义wordModel数据！！')
    }
  }
  get wordModel() {
    return this.vModel.wordModel
  }
  set setWordModel(newStatus) {
    this.vModel.wordModel = newStatus
  }
  // 内更新
  _update() {
    let n;
    return n
  }
  setStatus(prototype, status) {
    let newStatus = _update(prototype, status)
    this.setWordModel(newStatus)

  }
  _newBp() {


  }
  input(value) {

  }
  _register() {

    let vModel = this.vModel
    let keyContrl = this._kc

    keyContrl.entry.call(this)
    keyContrl.delete.call(this)
    keyContrl.up.call(this)
  }
}
// 输入事件
let input = () => {

}
let config = {
  t_c: {
    real: 'color',
    normal: '#000000'
  },
  t_f: {
    real: 'font-family',
    normal: 'Arial'
  },
  t_s: {
    real: 'font-size',
    normal: '16px'
  },
  t_i: {
    real: 'padding-left',
    normal: 0
  },
  t_dir:{
    real: 'text-left',
    normal: 'left'
  },
  // 是否有内容
  t_t_x: false,
  // 是否有格式，先不扩展
  t_t_t: '.'

}
// 默认对象
export let normalBp = () => {
  let normal = {
    t: 'bp',
    m: {
      // 色彩
      t_c: '#000000',
      // 字体
      t_f: 'Arial',
      // 字体大小
      t_s: 20,
      // 字体类别
      t_t: 0,
      // 字体缩进
      t_i: 0,
      // 字体方向 text-align
      t_dir: 'l',
      // 是否填字
      t_t_x: true,
      // 是否有字体类别
      t_t_t: false
    }
  }
  return normal
}
export let normalTb = (row, col) => {
  /*
  * table: {
  *   t: 'tb',
  *   m: [{
  *    t: {
  *      t_w: 12,
  *      t_bp: []
  *    },
  *    t_has_a: false
  *   }]
  * }
  *
  * */

  let tbw = '900'
  let tb = () => {
    let normal = {
        // 是否有选中
        t_s: false,
        // 单元格宽度
        t_w: 0,
        // 单元格高度
        t_h: 0,
        // 显而易见
        colspan: 1,
        // 显而易见
        rowspan: 1,
        // 段落内容
        t_bp: [normalBp()]
    }
    return normal
  }

  let table = []
  for(let r=0; r<row; r++) {
    table.push({
      // 是否是单独一个tr
      has_a_r: false,
      t: [],
      col_l: col
    })
    for(let c=0;c<col;c++) {
      table[r]['t'].push(tb())
    }
  }
  table.map((tr) => {
    tr['t'].map((t, i) => {
      console.log(i, 'i')
      t.t_w = tbw/col
      console.log(t.t_w, 't_t_w')
      t.i= i
    })
  })

  return { t: 'tb', m: table, w: tbw}
}

function word(Vue, options) {
  return class wordClass {
    constructor(data) {

    }
  }
}
export class selection {
  constructor(el) {
    this.el = el
    this.pack = {
      // 盒子视口左边距离
      left: 0,
      // 盒子视口上边距离
      top: 0,
      // 盒子文本内容
      txt: '',
      // 鼠标距离盒子x方向位置
      x: 0,
      // 鼠标距离盒子x方向位置
      y: 0,
      // 当前光标距离盒子宽度
      w: 0,
      // 光标所在的第几个字
      i: 0,
      // 光标距离视口x方向
      cursorX: 0,
      // 光标距离视口y方向
      cursorY: 0,
      // 当前字宽
      prevW: 0
    }
    this.init()
  }
  init(ctx, cursor) {


    this.pack = {
      ...this.pack,
      ...this.analy()
    }
    console.log(this.pack)
    // this.ctx = ctx
    //this.curcor = cursor
  }
  get status() {
    return false
  }
  packTxt(e) {
    let el = this.el
    let rect = el.getBoundingClientRect()
    this.pack = {
      ...this.pack,
      left: rect.left,
      top: rect.top,
      txt: this.txt(),
      x: e.pageX - rect.left,
      i: 0,
    }
    return this.location(e)
  }
  analy() {
    let style = this.el.style
    let pack = {}
    let fontFamily = style['font-family']
    let fontSize = style['font-size']
    pack.font = fontSize+ ' '+ fontFamily
    pack.fontW = fontSize
    pack.prevW = 0
    return pack
  }
  txt() {
    return this.el.innerText
  }
  location(e) {
    let pack = this.pack
    if(!this.ctx) {
      let canvas = document.getElementById('word-selection')
      if(canvas == undefined) {
        throw new Error('没有找到word-selection的canvas dom')
        return
      }
      this.ctx = canvas.getContext('2d')
    }
    let ctx = this.ctx
    let i = 0
    let currWord = pack.txt[i]
    let fontW = 0
    let w = 0
    while(pack.x>=w&&(i<=pack.txt.length)) {
      ctx.font= pack.font;
      //console.log(currWord)
      fontW =  ctx.measureText(currWord).width
      pack.prevW = fontW
      w+=fontW
      i++
      currWord = pack.txt[i]
    }

    let ver = ( fontW - w+ pack.x)-fontW/2
    if(ver<= 0) {
      i--
      w-=fontW
    }
    pack.i = i
    pack.w = w
    pack.cursorX = w+ pack.left
    pack.cursorY = pack.top
    return pack
  }
}

