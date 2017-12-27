import {range} from "../until/dom";
/*
*
*
* this.place = {
      node,
      txtNode,
      one: rect.height>=nodeH,
      rows: Math.ceil(nodeH/rect.height),
      txtRegion: [0, txtNode.length],
      parentNode: node.parentNode,
      infoId: id||node.dataset.id
    }
* */
export let posFromMouse = (doc, e) => {
  // let txt = doc.place.txt
  // let node = this.$refs[txt]
  let x = e.clientX
  let y = e.clientY
  let place = doc.place
  let node = place.node
  let rect = node.getBoundingClientRect()
  let placeLeft = x- rect.left
  let placeTop = y- rect.top

  doc.updateLine({
    placeLeft,
    placeTop,
    x,
    y
  })
  return getPos(rect, place, doc.line, place.txtNode)
}
export let getPos = (rect, place, line, txtNode) => {
  // console.log(txtNode, 'te')
  let top = 0
  let left = 0
  let h = place.txtH
  let txtLast = place.txtRegion[1]
  let x = line.x
  // console.log(txtNode, place.start, place.end)
  // let lastL = range(txtNode, place.start, place.end).getClientRects()[0]
  // place.start++
  // place.end++
  if(place.rows>1) {
    let rowNum = (Math.ceil(line.placeTop/place.txtH)-1)
    top = rect.top + rowNum * place.txtH
    // x+= rowNum*place.txtW
  }else {
    top = rect.top
  }
  // console.log(x, 'x...', range(txtNode, 7,8).getClientRects())
  while(left<=x) {
    place.start<=(txtLast-1) && place.start++
    place.end<=(txtLast-1) && place.end++
    let rect = range(txtNode, place.start, place.end).getClientRects()[0]
    left = rect.x
  }
  place.end > place.start&& place.end--
  place.start--
  let lastL = range(txtNode, place.start, place.end).getClientRects()[0].x
  let dir = (x - ((left-lastL)/2+lastL)) >=0 ? 'right': 'left'
  if(dir === 'right') {
    place.start<=(txtLast-1) && place.start++
    place.end <= (txtLast-1) &&place.end++
  }
  return {
    left: dir=== 'right' ? left: lastL,
    h,
    wh: place.start,
    top
  }

}



