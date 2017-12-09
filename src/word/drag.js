import Event from './event'
export default function(el) {
  let nw = new Event(el)
  let cx =0, cy =0;
  // 保证每个document事件单一
  let isDown = false
  nw.addEvent('mousedown', function(e) {
    isDown = true
    //console.log('hhh')
    cx = e.clientX
    cy = e.clientY
    let olx = e.clientX - el.offsetLeft
    let oly = e.clientY - el.offsetTop
    nw.trigger('down', el, { olx, oly } )
    nw.addEvent(window.document, 'mousemove', function(e) {
      //console.log('....hhh')
      let posX = e.clientX -olx
      let posY = e.clientY -oly
      nw.trigger('move', el,
        {
          posX,
          posY,
          moveX: e.clientX-cx,
          moveY: e.clientY-cy
        })
    })
  })

  nw.addEvent(document, 'mouseup', function(e) {
    if(isDown) {
      nw.trigger('up', el,
        {
          moveX: e.clientX-cx,
          moveY: e.clientY-cy
        })
      nw.removeEvent(document, 'mousemove')
      isDown = false
    }
  })

  return nw;
}
