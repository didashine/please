import { getOffset } from "./dom";
// 对drag的封装
class dragDom {
  constructor(el) {
    this.el = el
    this.offsetLeft = getOffset(el, 'offsetLeft', true)
    this.offsetTop = getOffset(el, 'offsetTop', true)
  }

}
// 返回true说明无相交在边缘以外
export const isEdge = (el, toEl, isEasy = false) => {
  // 获取 el的四向
  let elledge = getOffset(el, 'offsetLeft', isEasy)+ el.offsetWidth
  let elredge = getOffset(el, 'offsetRight', isEasy)+ el.offsetWidth
  let eltedge = getOffset(el, 'offsetTop', isEasy)+ el.offsetHeight
  let elbedge = getOffset(el, 'offsetTop', isEasy)+ el.offsetHeight
  // 获取toEl的四向
  let toEll = getOffset(toEl, 'offsetLeft', isEasy)
  let toElr = getOffset(toEl, 'offsetRight', isEasy)
  let toElt = getOffset(toEl, 'offsetTop', isEasy)
  let toElb = getOffset(toEl, 'offsetTop', isEasy)
  return ( elledge < toEll || eltedge < toElt || elredge < toElr || elbedge < toElb)
}
// 接收一个dom和一组dom判定出该dom和一组dom中最相邻的dom
export const adjoin = (el, els) => {
  // 安全转化
  els = [...els]
  // 设置一个最大的值对象
  let TO_MIN_TARGET = {distance: Math.MAX_VALUE}
  els.map((toEl, index) => {
    let ellc = getOffset(el, 'offsetLeft', true)+ el.offsetWidth/2
    let toEllc = getOffset(toEl, 'offsetLeft', true)+ toEl.offsetWidth/2
    let x = ellc - toEllc
    let eltc = getOffset(el, 'offsetTop', true)+ el.offsetHeight/2
    let toEltc = getOffset(toEl, 'offsetTop', true)+ el.offsetHeight/2
    let y = eltc - toEltc
    let target = {distance: Math.sqrt(x*x+ y*y), index, el: toEl}
    TO_MIN_TARGET = target.distance > TO_MIN_TARGET.distance ? TO_MIN_TARGET : target
  })
  return TO_MIN_TARGET
}

