import {getTextNode, hasClass, prevNodeTxtLength} from "../until/dom";

export {prevNodeTxtLength, hasClass, getTextNode} from '../until/dom'

export function selection() {
  let selection = window.getSelection()
  return selection
}
export function range() {
  return selection().getRangeAt(0)
}

// 是否要换行
export let isOverWidth = (el) => {

}
export let trys = (r, el) => {
  // console.log(el, 'idel')
  let id = el.dataset.id
  if(!id||!hasClass(el, 'b_txt')) {
    el = el.getElementsByClassName('b_txt')[0]
    let txtNode = getTextNode(el)
    // console.log(txtNode, 'txtNode below')
    r.setStart(txtNode, 0)
    r.setEnd(txtNode, 1)
  }
  // return el
  // console.log(getTextNode(el), 'txt')
  // if(!hasClass(el, 'b_txt')) {
  //   el = el.getElementsByClassName('b_txt')[0]
  // }
  // r.setStart(getTextNode(el), 0)

  return el
}
//
export let editObj = (doc) => {
  let r = doc.range.r
  let editNode = trys(r, doc.range.editNode)
  // console.log(node, 'r.commonAncestorContainer.parentNode', node.childNodes)
  let editTxt = doc.range.editNode.textContent
  let startOffset
  let bpStart
  startOffset = r.startOffset
  bpStart = startOffset+ prevNodeTxtLength(editNode)
  return {
    editTxt,
    bpStart,
    ...doc.place,
    ...doc.range,
    editNode,
    // 编辑的node个数
    nodeNum: editNode.parentNode.childNodes.length
  }
}
// toolbar
export let toolBarEdit = (el, doc) => {
  let st = editObj(doc)


}
// 数据删除
export let deleted = (el, doc) => {
  let st = editObj(doc)
  // let tl = txt.length
  let interceptTxt = st.editTxt.substr(st.startOffset, st.editTxt.length)
  // console.log(st, 'st......', interceptTxt)
  return {
    ...st,
    deleteStart: st.startOffset,
    interceptTxt: interceptTxt.trim() === '' ? '\u00A0': interceptTxt ,
    place: doc.place
  }
}
// 新建行
export let newRow = (el, doc) => {
  let st = editObj(doc)
  let retainsTxt = st.editTxt.substr(0, st.startOffset)
  let interceptTxt = st.editTxt.substr(st.startOffset, st.editTxt.length)
  return {
    ...st,
    retainsTxt: retainsTxt.trim() === '' ? '\u00A0': retainsTxt,
    interceptTxt: interceptTxt.trim() === '' ? '\u00A0': interceptTxt
  }
}

export let edit = (el, doc) => {
  let st = editObj(doc)
  // let startOffset = r.startOffset
  // return
  return {
    ...st
  }
}






/*
*
*
*
*
*
*
* */

