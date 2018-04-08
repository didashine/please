
import {getTextNode, hasClass, siblingIncludeOwnerAndIndex} from "../until/dom";
import { range as ranges } from './edit'
import {range, siblingIncludeOwner} from '../until/dom'
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
    // 位置信息,每次编辑更新一次，用于记录点击的位置，在数据模型上的位置->记录在第几页编辑，，记录在第几行编辑
    this.place = null
    // 要处理的段落
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
  // 当前编辑节点的前面部分文字
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
    return this.editTxtNode.textContent
  }
  // 更名
  getBpNodeNum() {
    return this.range.editNode.parentNode.childNodes.length
  }
  getLineNodeNum() {
    return siblingIncludeOwner(this.range.editNode).length
  }
  getNodeLocation(path) {
    path = path || this.range.editNodeAbsolutePath;
    return path.split('.').slice(0, -1).join('.')
  }
  getPrevNodePath(path) {
    let index = this.range.editNodeRelativeI
    if(index>=1) {
      return this.getNodeLocation(path)+'.'+(this.range.editNodeRelativeI-1)
    }
    return false
  }
  // 获取bp路径
  getBpLocation(path) {
    path = path || this.place.bpAbsolutePath;
    return path.split('.').slice(0, -1).join('.');
  }
  getNextBpPath(path) {
    return this.getBpLocation(path)+'.'+(this.place.bpRelativeI+1)
  }
  getLineLocation(path) {
    path = path || this.place.lineAbsolutePath;
    return path.split('.').slice(0, -1).join('.');
  }
  getNextLinePath(path) {
    return this.getLineLocation(path)+'.'+(this.place.lineRelativeI+1)
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
    return this.getBpLocation()+'.'+(this.place.bpRelativeI-1)
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
    // window.getSelection().getRangeAt(0) collapsed 返回一个用于判断 Range 起始位置和终止位置是否相同的布尔值。
    // false: 表示选中了多个部分
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Range
    if(!r.collapsed) {
      let isInSameBp = (startNode, endNode) => {
        return startNode.parentNode == endNode.parentNode
      }
      let startNode = r.startContainer.parentNode
      let endNode = r.endContainer.parentNode
      if(isInSameBp(startNode, endNode)) {
        return
      }else {
        throw new Error('不在同一个行小块')
      }
    }
    // 更新toolbar
    // doc设定当前编辑bp部分

    // 拿到当前正在编辑区域的dom节点
    let editNode  = r.commonAncestorContainer.parentNode
    let editLine = editNode.parentNode
    if(!isHTMLElement(e)&&!hasClass(e.target, 'jfs-word')) {
      if(hasClass(editLine, 'bp_txt')) {
        this.updateStruture(editLine, r.startOffset, r, e)
        this.vm.updateToolbar(
          this.place.lineAbsolutePath,
          this.range.editNodeRelativeI)
      }else {
        throw new Error('没选择')
      }
    }
    if(isHTMLElement(e)) {
      this.updateStruture(e, r.startOffset, r)
    }
  }

  /**
   *
   * @param {*} node 当前bp(段落)
   * @param {*} deleteI 光标起始节点位置数字
   * @param {*} r 当前ranges对象
   * @param {*} e
   */
  updateStruture(node, deleteI, r, e) {
    this.place = {
      // 在哪页
      docPath: node.dataset.id.match(/\d+/g)[0],
      // 当前行第几个节点
      lineNode: node,
      type: '',
      /* inTable: !!node.parentNode.parentNode.dataset.intable, */
      // 行index
      lineRelativeI: parseInt(node.dataset.index),
      // 具体节点
      lineAbsolutePath: node.dataset.id,
      // bp(段落)绝对路径
      bpAbsolutePath: node.dataset['bpId'],
      // bp相对的index
      bpRelativeI: parseInt(node.dataset['bpIndex']),
      ...(e||{})
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

