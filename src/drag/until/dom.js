const getOffset = (el,type, isEasy = false) => {
  let l = el[type];
  if(isEasy) return parseInt(l)
  while (el = el.offsetParent) {
    l += el[type];
  }
  return parseInt(l)
}
const getStyle = (el, css) => {
  return el.currentStyle ? el.currentStyle[css]:
    getComputedStyle(el, false)[css]
}
export { getStyle, getOffset }
