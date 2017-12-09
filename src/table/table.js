// js
import event from '../drag/until/event'

const evet = new event()
const fontMap = {
  '16': {
    en: '',
    china: 16
  },
  '12': {
    en: '',
    china: 12
  },
  '18': {
    en: 8.6,
    china: 18,
    space: 6,
    num: 12,
    other: 13
  }
}
const setProto = (context, proto) => {
  for (let key in proto) {
    context[key] = proto[key]
  }
}
const dom = {
  getStyle(el, css) {
    return el.currentStyle ? el.currentStyle[css] : getComputedStyle(el, false)[css]
  }
}
const core = {
  // 按键删除
  delete() {

  },
  // 按键换行
  enter() {

  },
  // 鼠标拖选
  selection() {

  }
}

class selection {
  constructor(opt) {
    this._setProto(this, {
      el: document.body,
      // 可读可写的字体段落
      class: 'ly-font-bp-wr',
      ...opt
    })
  }

  _setProto(context, proto) {
    for (let key in proto) {
      context[key] = proto[key]
    }
  }

  _fontParse(style) {
    let type = parseInt(style.fontSize);
    let set = fontMap[type]
    return {
      ...set
    }
  }

  _fontType(font) {
    let reg = {
      space: /^\s$/,
      num: /^\d$/,
      china: /^[\u4e00-\u9fa5]$/,
      en: /^[a-zA-Z]$/
    }
    let tar = 'other'
    for (let key in reg) {
      if (reg[key].test(font)) {
        tar = key
        break
      }
    }
    return tar
  }
  getRangeDown(pos, str, style) {
    var c=document.getElementById("ctx");
    let ctx=c.getContext("2d");
    let set = this._fontParse(style)
    let rs = {
      lastM: 0,
      x: 0,
      index: 0
    }
    let num = 0
    let i = 0
    let strAll = ''
    console.time('j')
    for (; i < str.length; i++) {
      let w = 0
      //let type = this._fontType(str[i])
     // console.log('type', type, 'set', set.china, pos)
     //  switch (type) {
     //    case 'space':
     //      w = set.space
     //      break
     //    case 'num':
     //      w = set.num
     //      break
     //    case 'en':
     //      w = set.en
     //      break
     //    case 'china':
     //      w = set.china
     //      break
     //    case 'other':
     //      w = 12
     //      break
     //  }
      console.time('h')

      ctx.font="18px Arial";
      var txt=str[i]
      //console.log(ctx.measureText(txt).width, 'width')
      strAll += str[i]
      w = ctx.measureText(txt).width
      console.timeEnd('h')
      num += w
      if(num >= pos) {
        let ver = (w-num+pos)-w/2
        i= ver<=0? --i: i
        if(ver<= 0) {
          i--
          strAll= str.substring(0, str.length-1)
        }

        rs = {
          lastM: w,
          x: num = ver<=0 ? num -w : num,
          str: strAll,
          extStr: str.substring(i++)
        }
        // console.log(num, num-pos-w/2, w-(num-pos), w/2)
        break
      }
    }
    console.timeEnd('j')
    return {...rs, index: i < 0 ? 0 : i}
  }

  getPadding() {

  }

  // 找到段落
  getBP(e) {

  }

  focus(el, dat) {
    // evet.addEvent(this.el,'mouseDown', (e) => {
    //
    // })
  }
}


//
import './table.css'

const table = {
  tbd: [
    {
      tdd: [{
        w: 100,
        colspan: '',
        rowspan: ''
      }, {
        w: 400
      }, {}]
    },
    {
      w: 400,
      tdd: [{}, {}, {}]
    },
    {
      tdd: [{}, {}, {}]
    }
  ]
}
const genTr = () => {
  let tr = {
    colspan: '',
    rowspan: ''
  }

}
let getSelection = new selection()


const t = [{
  txt: '我lda哈哈2大&d.sadfdasdfasdfasdfasdf.1sdfasdfadf1dsfasd说的话法师地方好的法师地方daZ黑', style: {
    fontSize: '18px'
  }
}, {
  txt: '嘿嘿饿', style: {
    fontSize: '18px'
  }
}]
export default {
  name: 'STable',
  data() {
    return {
      t,
      cur: {},
      ctx: ''
    }
  },
  mounted() {
    let ifr = document.getElementsByClassName('ifr')[0]
    var c=document.getElementById("ctx");
    let ctx=c.getContext("2d");
    this.ctx = ctx
    //evet.addEvent(ifr, '')
  },
  render(h) {
    const control = (h) => {
      let r = 0
      return this._l(table.tbd, (tbd) => {
        r += tbd.w
        return (
          <div class='line' style={{left: r + 'px'}}>
          </div>)
      })
    }
    return (
      <div class="table">
        <canvas id='ctx'></canvas>
        <div class="line" id='line'>
          <textarea name="" id="linearea" cols="30" rows="10"
            onInput={(e) => {
              let ctx = this.ctx
              ctx.font="18px Arial";
              let w = ctx.measureText(e.target.value).width
              let str = this.t[0].txt
              this.t[0].txt = this.cur.str+ e.target.value+ this.cur.extStr
              line.style.left = parseInt(line.style.left)+ w+ 'px'
              e.target.value = ''
              // console.log(ifr.innerText)
            }}
          ></textarea>
        </div>
        <div class="t">
          {
            this._l(this.t, (a) => {
              return (
                <span style={a.style} onClick={(e) => {
                  let pageX = e.pageX
                  let left = e.target.getBoundingClientRect().left
                  let pos = pageX - left
                  let i = getSelection.getRangeDown(pos, a.txt, a.style)
                  this.cur = i
                  // console.log(i, 'i', left)
                  line.style.left = e.target.offsetLeft+ i.x+ 'px'
                 // console.log(ifr.innerText)
                  linearea.style.width = '8px'
                  linearea.focus()

                }}>{a.txt}</span>
              )
            })
          }
        </div>
      </div>
    )
  }
}
