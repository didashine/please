import timeTraveler from '../until/timeTraveler'
import {newRow, edit, deleted} from '../core/edit'
import {splice, replace, push, setProperty, getProperty, sliceMutable, setMutable} from "./immutable";
import {normalBp, normalTb} from "../core/core";
import {getTextNode} from "../until/dom";
// 需要bindvm
export default function dataCenter(data, vm) {
  let history = timeTraveler(12)
  history.record(data)
  let options = {
    bind(vms) {
      vm = vms
      return options
    },
    newTable(selTable, doc, data, conf) {
      console.log(doc.place, 'doc.place')
      let path = doc.place.bpAbsolutePath.split('.').slice(0, -1)
      data = splice(data, path, doc.place.bpRelativeI+1, 0, normalTb(...selTable, conf))
      return splice(data, path, doc.place.bpRelativeI+2, 0, normalBp(conf))
    },
    newRow(el, doc, data) {
      let update = newRow(el, doc)
      // 当前行
      // 修改当前的数据
      // 新建行数据
      let sliceIntercept = sliceMutable(data, update.bpAbsolutePath+'.m', update.editNodeRelativeI, update.nodeNum)
      sliceIntercept[0].t_txt = update.interceptTxt
      // 设置当前行保留下来的数据
      let sliceRetains = sliceMutable(data, update.bpAbsolutePath+'.m', 0, update.editNodeRelativeI+1)
      sliceRetains[sliceRetains.length-1].t_txt = update.retainsTxt
      let path = update.bpAbsolutePath.split('.').slice(0, -1)
      let newBp = normalBp()
      newBp.m = sliceIntercept
      data = setProperty(data, update.bpAbsolutePath+'.m', sliceRetains)
      data = splice(data, path, update.bpRelativeI+1, 0, newBp)
      return { data, newElClass:  [...path, update.bpRelativeI+1].join('.:')}
    },
    deleted(el, doc, data) {
      let update = deleted(el, doc)
      let switchSpan = false
      let prevBp
      let prevTextNode
      let prevEndOffset
      if(doc.deleteI!== 0) {
        data = setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.editTxt)
      }
      if(update.deleteStart == 1) {
        switchSpan = true
        // 如果后面没有内容了
        if(update.editTxt.length<=1&&update.nodeNum>1) {
          // 删除当前节点
          data = splice(data, update.bpAbsolutePath+'.m', update.editNodeRelativeI, 1)
        }else {
          data = setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.interceptTxt)
        }
      }
      if(update.deleteStart == 0&&update.bpRelativeI>=1) {
        let n = options.removeRow(el, doc, data, update)
        prevTextNode= n.prevTextNode
        prevBp = n.prevBp
        prevEndOffset = n.prevEndOffset
        data = n.data
        // throw new Error('到了删除季节')

        // options.removeRow(el, doc, data, update)
      }
      // if(doc.deleteI == 0&&update.nodeNum == 1) {
      //   switchSpan = true
      //   n = options.removeRow(el, doc, data, update)
      // }

      return {
        needSelectRow: update.deleteStart == 0&&update.bpRelativeI>=1,
        isBpBegin: update.deleteStart == 0,
        // 是否需要删除节点
        switchSpan,
        // 删除文本的节点
        deleteStart: update.deleteStart,
        delNode: update.editNode,
        prevTextNode,
        prevBp,
        prevEndOffset,
        //
        data
      }

    },
    removeRow(el, doc, data, update) {
      let path = update.bpAbsolutePath.split('.')
      let bpRelativeI =  update.bpRelativeI
      let prevBp;
      let prevTextNode;
      let editTxt = update.editTxt;
      let spaceReg = /\u00A0/g
      if((update.editTxt.match(spaceReg)||editTxt.trim() === '')&&update.nodeNum==1) {
        data = splice(data, path.slice(0, -1), bpRelativeI, 1)
      }else {
        let sliceInterceptTxt = sliceMutable(data, update.bpAbsolutePath+'.m', update.editNodeRelativeI , update.nodeNum)
        sliceInterceptTxt[0].t_txt = update.interceptTxt
        data = push(data, [...path.slice(0, -1), bpRelativeI-1, 'm'], ...sliceInterceptTxt)
        data = splice(data, path.slice(0, -1), bpRelativeI, 1)
      }
      path.splice(path.length-1, 1, bpRelativeI-1)
      prevBp = document.getElementsByClassName(path.join('.').replace(/\./g, '.:'))[0]
      prevTextNode = getTextNode(prevBp.childNodes[prevBp.childNodes.length-1])
        //let sliceRetains = splice()
      return {
        data,
        prevBp,
        prevTextNode,
        prevEndOffset:  prevTextNode&&prevTextNode.textContent.trim().length
      }
    },
    edit(value, doc, data) {
      let update = edit(value, doc)
      console.log(update.editTxt, '.......', doc.range.r)
      data = setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.editTxt)
      history.record(data)
      return {data, ...update}
    },
    asyncDom: function(fn) {
      this.$nextTick(() => {
        fn.call(this)
      })
    }.bind(vm),
    record: history.record,
    Undo: history.Undo,
    Redo: history.Redo,
    history: history.history
  }
  return options
}
