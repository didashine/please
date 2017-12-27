import Event from './event'
export default function(el, stop) {
  let nw = new Event(el)
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
      nw.trigger('move', el,
        {
          e,
          posX,
          posY,
          moveX: e.clientX-cx,
          moveY: e.clientY-cy,
          originX: cx,
          originY: cy,
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
