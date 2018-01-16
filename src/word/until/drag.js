import Event from './event'
export default function(el) {
  let nw = new Event(el)
  // 鼠标按下时的位置
  let cx =0, cy =0;
  // 保证每个document事件单一
  let isDown = false
  nw.addEvent('mousedown', function(e) {
    isDown = true
    cx = e.clientX
    cy = e.clientY
    let olx = e.clientX - el.offsetLeft
    let oly = e.clientY - el.offsetTop
    nw.trigger('down', el, { e, olx, oly, originX: cx, originY: cy } )
    nw.addEvent(window.document, 'mousemove', function(e) {
      //console.log('....hhh')
      let posX = e.clientX -olx
      let posY = e.clientY -oly
      // 这里所有的鼠标位置都是client(非page，相对视口的位置，并且不做兼容)
      nw.trigger('move', el,
        {
          // 触发者的event(不一定是当前绑定的el)
          e,
          // 移动的相对距离(如果你想改变拖拽盒子的位置，请使用它，el.style.left= posX+'px')
          posX,
          posY,
          // 移动了绝对的距离(如果你想知道拖拽盒子移动了多少距离，请使用它)
          moveX: e.clientX-cx,
          moveY: e.clientY-cy,
          // 原始按下的鼠标位置
          originX: cx,
          originY: cy,
          // 当前鼠标位置
          currentX: e.clientX,
          currentY: e.clientY
        })
    })
  })

  nw.addEvent(document, 'mouseup', function(e) {
    if(isDown) {
      nw.trigger('up', el,
        {
          moveX: e.clientX-cx,
          moveY: e.clientY-cy,
          e
        })
      nw.removeEvent(document, 'mousemove')
      isDown = false
    }
  })

  return nw;
}
