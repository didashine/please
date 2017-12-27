
import {range} from "./edit";
let getTextNode = (node) => {
  if(node.nodeType == 3) {
    return node
  }
  let child = [...node.childNodes]
  return child.filter((node) => {
    if(node.nodeType == 3) return true
  })[0]
}
export default class Doc {
  constructor() {
    this.place = null
    this.line = null
    this.range = null
    // 是否删除到了第一位
    this.deleteI = -1
    this.switchSpan = false
  }
  // node 当前bp， deleteI, r当前ranges对象
  updateStruture(node, deleteI, r) {
    // let txtNode = getTextNode(node)
    console.log(node, 'node..........', r.commonAncestorContainer)
    this.place = {
      bpNode: node,
      type: '',
      // bp相对的index
      bpRelativeI: parseInt(node.dataset.index),
      // bp绝对路径
      bpAbsolutePath: node.dataset.id.replace(/:/g, '')
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
  updateLine(options) {
    this.line = options
  }
}

