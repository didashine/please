
import {range} from "./edit";
// let getTextNode = (node) => {
//   if(node.nodeType == 3) {
//     return node
//   }
//   let child = [...node.childNodes]
//   return child.filter((node) => {
//     if(node.nodeType == 3) return true
//   })[0]
// }
let inTable = (node) => {
}
export default class Doc {
  constructor() {
    this.place = null
    this.range = null
    // 是否删除到了第一位
    this.deleteI = -1
    // typeWriting typeWritingEnd originWriting
    this.spellStatus = 'originWriting'
    this.tableModel = null
    // this.inComplate = false
  }
  updateTableModel(model) {
    this.tableModel = model
  }
  setSpellStatus(type) {
    this.spellStatus = type
  }
  // node 当前bp， deleteI, r当前ranges对象
  updateStruture(node, deleteI, r, exist) {

    this.place = {
      docPath: node.dataset.id.match(/\d+/g)[0],
      // collapsed
      bpNode: node,
      type: '',
      inTable: !!node.parentNode.parentNode.dataset.intable,
      // bp相对的index
      bpRelativeI: parseInt(node.dataset.index),
      // bp绝对路径
      bpAbsolutePath: node.dataset.id.replace(/:/g, ''),
      ...(exist||{})
    }
    let editTxtNode = r.commonAncestorContainer
    this.range = {
      r,
      editTxtNode,
      editNode: editTxtNode.parentNode,
      editNodeRelativeI: parseInt(editTxtNode.parentNode.dataset.index),
      editNodeAbsolutePath: editTxtNode.parentNode.dataset.id.replace(/:/g, ''),
      startOffset: r.startOffset,
      endOffset: r.endOffset
    }
    this.deleteI = deleteI !== undefined ? deleteI : -1
  }
}

