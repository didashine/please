
import {getTextNode, hasClass, siblingIncludeOwnerAndIndex} from "../until/dom";
import { range as ranges } from './edit'
import {range} from '../until/dom'
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
  constructor(vm) {
    this.place = null
    this.range = null
    // 是否删除到了第一位
    // typeWriting typeWritingEnd originWriting
    this.spellStatus = 'originWriting'
    this.tableModel = null
    this.vm = vm
    // this.inComplate = false
  }
  get editTxtNode() {
    return this.range.editTxtNode
  }
  get startOffset() {
    return this.range.startOffset
  }
  updateTableModel(model) {
    this.tableModel = model
  }
  setSpellStatus(type) {
    this.spellStatus = type
  }
  rangeSet(txtNode, start, end, force = true) {
    txtNode = getTextNode(txtNode)
    // let r = ranges() // range对象
    // r.setStart(txtNode, start)
    // r.setEnd(txtNode, end)
    let r = range(txtNode, start, end)
    if(force) {
      let selection = window.getSelection()
      selection.removeAllRanges()
      // 插入新的光标对象
      selection.addRange(r)

    }
  }
  当前编辑节点的前面部分文字
  getRetainsTxt() {
    let txt = this.getTxt()
    let retainsTxt = txt.substr(0, this.startOffset)
    return retainsTxt.trim() === '' ? '\u00A0': retainsTxt
  }
  // 当前编辑节点的后面部分文字
  getInterceptTxt() {
    let txt = this.getTxt()
    let interceptTxt = txt.substr(this.startOffset, txt.length)
    return interceptTxt.trim() === '' ? '\u00A0': interceptTxt
  }
  getTxt() {
    console.log(this.editTxtNode)
    return this.editTxtNode.textContent
  }
  getBpNodeNum() {
    return this.range.editNode.parentNode.childNodes.length
  }
  getNodeLoaction(path) {
    path = path || this.range.editNodeAbsolutePath;
    return path.split('.').slice(0, -1).join('.')
  }
  getPrevNodePath(path) {
    let index = this.range.editNodeRelativeI
    if(index>=1) {
      return this.getNodeLoaction(path)+'.'+(this.range.editNodeRelativeI-1)
    }
    return false
  }
  // 获取bp路径
  getBpLoaction(path) {
    path = path || this.place.bpAbsolutePath;
    return path.split('.').slice(0, -1).join('.');
  }
  getNextBpPath(path) {
    return this.getBpLoaction(path)+'.'+(this.place.bpRelativeI+1)
  }
  getTxtNodeLocation() {
    return this.range.editNode.dataset.index
  }
  getPrevBpPath(pages) {
    if(pages === undefined) {
      throw new Error('参数pages必填')
    }
    pages =Array.isArray(pages) ? pages: pages['m']
    // 如果已经在当前页的第一个了
    if(!this.place.inTable&&this.place.bpRelativeI === 0) {
      let prevPageId = this.place.docPath
      if(prevPageId ==0) {
        return false
      }
      let prevPagePath = `m.${prevPageId}.m`
      return prevPagePath+'.'+ pages[prevPageId].length-1
    }
    return this.getBpLoaction()+'.'+(this.place.bpRelativeI-1)
  }
  isHTMLElement (e) {
    return (e instanceof HTMLElement)
  }
  updateDoc(e) {
    // 是否是dom
    let isHTMLElement = (e) => {
      return (e instanceof HTMLElement)
    }
    let r = ranges()
    // 表示选中了多个部分
    if(!r.collapsed) {
      let isInSameBp = (startNode, endNode) => {
        return startNode.parentNode == endNode.parentNode
      }
      let startNode = r.startContainer.parentNode
      let endNode = r.endContainer.parentNode
      if(isInSameBp(startNode, endNode)) {
        return
      }else {
        throw new Error('不通过，我们不一样')
      }
    }
    // 更新toolbar
    // doc设定当前编辑bp部分
    let editNode  = r.commonAncestorContainer.parentNode
    let editBp = editNode.parentNode
    if(!isHTMLElement(e)&&!hasClass(e.target, 'jfs-word')) {
      if(hasClass(editBp, 'bp_txt')) {
        this.updateStruture(editBp, r.startOffset, r, e)
        this.vm.updateToolbar(
          this.place.bpAbsolutePath,
          this.range.editNodeRelativeI)
      }else {
        throw new Error('没选择')
      }
    }
    if(isHTMLElement(e)) {
      this.updateStruture(e, r.startOffset, r)
    }
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
      bpAbsolutePath: node.dataset.id,
      ...(exist||{})
    }
    let editTxtNode = r.commonAncestorContainer
    this.range = {
      r,
      editTxtNode,
      editNode: editTxtNode.parentNode,
      editNodeRelativeI: parseInt(editTxtNode.parentNode.dataset.index),
      editNodeAbsolutePath: editTxtNode.parentNode.dataset.id,
      startOffset: r.startOffset,
      endOffset: r.endOffset
    }
  }
}

