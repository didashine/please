import Event from '../until/event'
import { getOffset } from "../until/dom";
let event = new Event()
//console.log(Velocity, 'Velocity')
class dragDom {
  constructor(el) {
    this.el = el
    this._left = getOffset(el, 'offsetLeft', true)
    this._top = getOffset(el, 'offsetTop', true)
  }
  update() {
    let el = this.el
    this['_left'] = getOffset(el, 'offsetLeft', true)
    this['_top'] = getOffset(el, 'offsetTop', true)
  }
}
class Drag {
  constructor(el, options) {
    this.dEl = new dragDom(el)
    this.event = event
    this.downX = 0
    this.downY = 0
    this.initDrag()
  }
  _recardScene( evt) {
    this.downX = evt.clientX
    this.downY = evt.clientY
  }
  _down() {
    let el = this.dEl.el
    el.style.position = 'absolute'
    el.style.zIndex++
  }
  _move(evt) {
    let el = this.dEl.el
    let left = evt.clientX - this.downX + this.dEl['_left']
    let top = evt.clientY - this.downY + this.dEl['_top']
    el.style.left = left + 'px'
    el.style.top = top + 'px'
  }
  _up(evt) {
    let el = this.dEl.el
    Velocity(el, {
        left: this.dEl['_left']+ 'px',
        top: this.dEl['_top']+ 'px'},
        { duration: 200 })
  }
  initDrag() {
    let el = this.dEl.el
    let eventBase = this.event
    eventBase.addEvent(el, 'mousedown', (evt) => {
      eventBase.trigger('mouseDown')
      evt = evt || window.evt
      this.downX = evt.clientX
      this.downY = evt.clientY
      this._down()
      this.dEl.update()
      eventBase.addEvent(document, 'mousemove', (evt) => {
        this._move(evt)
        eventBase.trigger('mouseMove')
      })
    })
    eventBase.addEvent(el, 'mouseup', (evt) => {
      this._up(evt)
      eventBase.trigger('mouseUp')
      eventBase.removeEvent(document, 'mousemove')
    })
  }
  mouseDown(fn) {
    this.event.on('mouseDown', fn)
  }
  mouseMove(fn) {
    this.event.on('mouseMove', fn)
  }
  mouseUp(fn) {
    this.event.on('mouseUp', fn)
  }
}
export default Drag
