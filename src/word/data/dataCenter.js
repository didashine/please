import timeTraveler from '../until/timeTraveler'
import {newRow, edit, deleted, uStyle} from '../core/edit'
import {splice, newArray, push, setProperty, unshift, getProperty,replace, sliceMutable, supSplice} from "./immutable";
import {normalBp, normalTb, easyB, normalPage, normalTd} from "../core/core";
import {getTextNode, hasClass, getOffset, prevNode} from "../until/dom";
import {spliceMap} from '../until/until'
import {NORMAL_CONFIG} from "../config/baseConfig";
let isSpaceTxt=(txt) => {
  let spaceReg = /^\u00A0$/
  return txt.match(spaceReg)||txt.trim() === ''
}
let compareEqual= (arr1, arr2) => {
  if(typeof arr1!=='object') {
    arr1 = [arr1]
  }
  if(typeof arr2!=='object') {
    arr2 = [arr2]
  }
  let equal = []
  for(let i= 0;i<arr1.length;i++) {
    for(let j= 0; j<arr2.length;j++) {
      if(compareIsEqual(arr1[i], arr2[j])) {
        equal.push(arr1[i])
      }
    }
  }
  return equal
}
let compareIsEqual = (compare, other) => {
  if(typeof compare === 'object') {
    if(compare.length === other.length&&
      Array.from(new Set(compare.concat(other))).length === compare.length) {
      return true
    }
    return false
  }else {
    if(compare === other) {
      return true
    }
    return false
  }
  return false
}
// 需要bindvm
export default function dataCenter(data, vm) {
  let history = timeTraveler(12)
  history.record(data)
  let options = {
    getData(worder, name) {
      return getProperty(worder, name)
    },
    bind(vms) {
      vm = vms
      return options
    },
    fillInData(el, data, {name}) {
      if(hasClass(el, 'b_txt')) {
        let path = el.dataset.id
        data = setProperty(data, replace(path)+'.t_txt', `@{${name}}`)
      }
      history.record(data)
      return data
    },
    //
    // 居中
    textCenter(doc, data, value) {
      let bp = doc.place.bpAbsolutePath
      // console.log(bp, '......')
      data = setProperty(data, bp+'.textAlign', value)
      history.record(data)
      return data
    },
    // 设置样式
    uStyle(el, doc, data, conf) {
      let update = uStyle(el, doc)
      // alert(JSON.stringify(data.toJS()))
      let gep = getProperty(data, update.bpAbsolutePath+'.m')
      let currentBp = newArray(gep)
      let oldBp = currentBp[update.editNodeRelativeI]
      let currentEditI = update.editNodeRelativeI
      let spaceReg = /^\u00A0/g
      let gen = [1, 0, 1]
      // alert(JSON.stringify(currentBp))
      if((update.retainsTxt.match(spaceReg)&&update.retainsTxt.length<2)||update.retainsTxt.trim() === '') {
        //console.log(update.retainsTxt, 'update.retainsTxt')
        // 删除当前
        currentBp.splice(currentEditI, 1)
        // 生成全新
        currentBp.splice(currentEditI+1, 0, easyB(update.retainsTxt, conf))
        gen = [0, 1, 1]
      }
      if(update.interceptTxt.match(spaceReg)||update.interceptTxt.trim() === '') {
        gen[2] = 0
      }
      if(!gen[0]) {
        // console.log('genNew')
        if(gen[2]) {
          currentBp.splice(currentEditI+1, 0, {...oldBp, t_txt: update.interceptTxt} )
        }
      }
      if(gen[0]) {
        // 修改当前的
        currentBp[currentEditI].t_txt = update.retainsTxt
        // 生成新的
        currentBp.splice(currentEditI+1, 0, easyB(undefined, conf))
        if(gen[2]) {
          currentBp.splice(currentEditI+2, 0, {...oldBp, t_txt: update.interceptTxt} )
        }
        // 补充

      }
     //  console.log(currentBp, 'curren5')
      // console.log(currentBp, 'curren5')
      data = setProperty(data, update.bpAbsolutePath+'.heads', false)
      data = setProperty(data, update.bpAbsolutePath+'.m', currentBp)
      let currAbPath = update.editNodeAbsolutePath.split('.').slice(0, -1)
      let newEditElClass = currAbPath.join('.')+'.'+ (gen[0] ? currentEditI+1: currentEditI)
      history.record(data)
      return {newEditElClass: newEditElClass.replace(/\./g, '.:'), data}
    },
    newTable(selTable, doc, data, conf) {

      let path = doc.place.bpAbsolutePath.split('.').slice(0, -1)
      // console.log(doc.place.bpRelativeI+1, path, normalTb(...selTable, conf))
      data = splice(data, path, doc.place.bpRelativeI+1, 0, normalTb(...selTable, conf))
      history.record(data)
      return {
        bpPath: path.join('.')+'.'+(doc.place.bpRelativeI+2),
        path: path.join('.')+'.'+(doc.place.bpRelativeI+1),
        data: splice(data, path, doc.place.bpRelativeI+2, 0, normalBp(conf))}
    },

    newRow(el, doc, data, conf) {
      let update = newRow(el, doc)
      // 当前行
      // 修改当前的数据
      // 新建行数据
      let sliceIntercept = sliceMutable(data, update.bpAbsolutePath+'.m', update.editNodeRelativeI, update.nodeNum)
      sliceIntercept[0].t_txt = update.interceptTxt
      spliceMap(sliceIntercept, (b, i) => {
        if(isSpaceTxt(b.t_txt)) {
          sliceIntercept.splice(i, 1)
          return true
        }
      })
      // console.log(sliceIntercept, 'sliceIntercep')
      // 设置当前行保留下来的数据
      let sliceRetains = sliceMutable(data, update.bpAbsolutePath+'.m', 0, update.editNodeRelativeI+1)
      sliceRetains[sliceRetains.length-1].t_txt = update.retainsTxt
      // m.?.m
      let path = update.bpAbsolutePath.split('.').slice(0, -1)
      let newBp = normalBp(conf)
      sliceIntercept.length>0 ?(newBp.m = sliceIntercept) : newBp.m.push(...sliceIntercept)
      data = setProperty(data, update.bpAbsolutePath+'.m', sliceRetains)
      data = splice(data, path, update.bpRelativeI+1, 0, newBp)
      history.record(data)
      return { data, newElClass:  [...path, update.bpRelativeI+1].join('.:'), newBpPath: [...path, update.bpRelativeI+1].join('.')}
    },
    deleted(el, doc, data) {
      let update = deleted(el, doc)
      let switchSpan = false
      let prevBp
      let prevTextNode
      let prevEndOffset
      //
      data= setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.editTxt)
      // 第一种情况下
      if(update.deleteStart == 1&&update.editNodeRelativeI>=1) {
        switchSpan = true
        // 如果后面没有内容了
        if(update.editTxt.length<=1&&update.nodeNum>1) {
          // 删除当前节点
          data = splice(data, update.bpAbsolutePath+'.m', update.editNodeRelativeI, 1)
        }
        else {
          // 还有内容
          data = setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.interceptTxt)
        }
      }
      // 删除文本
      if(update.deleteStart == 1&&update.editNodeRelativeI<1) {
        data = setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.interceptTxt)
      }
      if(update.deleteStart == 1&&update.editNodeRelativeI<1&&update.nodeNum>1) {
        data = splice(data, update.bpAbsolutePath+'.m', update.editNodeRelativeI, 1)
      }
      if(update.deleteStart == 0&&update.editNodeRelativeI<1) {
        // 如果后面没有内容了
        // 还有内容
        // data = setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.interceptTxt)
        let n = options.removeRow(el, doc, data, update)
        prevTextNode= n.prevTextNode
        prevBp = n.prevBp
        prevEndOffset = n.prevEndOffset
        data = n.data
      }
      // 如果在第0个了并且不是在第一个span
      // if(update.deleteStart == 0) {
      //   let n = options.removeRow(el, doc, data, update)
      //   prevTextNode= n.prevTextNode
      //   prevBp = n.prevBp
      //   prevEndOffset = n.prevEndOffset
      //   data = n.data
      //   // throw new Error('到了删除季节')
      //
      //   // options.removeRow(el, doc, data, update)
      // }
      // if(update.deleteStart == 0&&update.nodeNum == 1) {
      //   switchSpan = true
      //   let n = options.removeRow(el, doc, data, update)
      // }
      history.record(data)
      return {
        nodeNum: update.nodeNum,
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
      // 是否空， 空就一处段落
      if((update.editTxt.match(spaceReg)||editTxt.trim() === '')&&update.nodeNum==1) {
        data = splice(data, path.slice(0, -1), bpRelativeI, 1)
      }else {
        // 截取留下来的所有文本
        let sliceInterceptTxt = sliceMutable(data, update.bpAbsolutePath+'.m', update.editNodeRelativeI , update.nodeNum)
        sliceInterceptTxt[0].t_txt = update.interceptTxt
        spliceMap(sliceInterceptTxt, (b, i) => {
          if(isSpaceTxt(b.t_txt)) {
            sliceInterceptTxt.splice(i, 1)
            return true
          }
        })
        let prevBpPath = [...path.slice(0, -1), bpRelativeI-1, 'm']
        let prevBpData = getProperty(data, prevBpPath)
        if(prevBpData.length === 1&&prevBpData[0].t_txt.match(spaceReg)) {
          data = setProperty(data, prevBpPath, [])
        }
        data = push(data, prevBpPath, ...sliceInterceptTxt)
        data = splice(data, path.slice(0, -1), bpRelativeI, 1)
      }
      // 切割路径
      path.splice(path.length-1, 1, bpRelativeI-1)
      prevBp = document.getElementsByClassName(path.join('.').replace(/\./g, '.:'))[0]
      prevTextNode = getTextNode(prevBp.childNodes[prevBp.childNodes.length-1])
        //let sliceRetains = splice()
      return {
        data,
        prevBp,
        prevTextNode,
        prevEndOffset: prevTextNode&&prevTextNode.textContent.trim().length
      }
    },
    edit(value, doc, data) {
      let update = edit(value, doc)
      data = setProperty(data, update.editNodeAbsolutePath+'.t_txt', update.editTxt)
      history.record(data)
      return {data, ...update}
    },
    // 数据更新统一接口
    update: function(data) {
      this.worder = data
    }.bind(vm),
    // 快捷
    u: function(data) {
      options.update(data)
    }.bind(vm),
    //
    asyncDom: function(fn) {
      this.$nextTick(() => {
        fn.call(this)
      })
    }.bind(vm),
    setTableH(worder, el, path, bp) {
      let trDom = el.getElementsByTagName('tr')
      let trData = bp? bp.m: getProperty(worder, path).m
      console.log(trDom, 'trDom', trData, path)
      trData.map((tr, tri) => {
        worder = setProperty(
          worder,
          `${path}.m.${tri}.h`,
          trDom.item(tri).clientHeight)
      })
      return worder
    },
    setBpH(worder, el, name, offsetH = false) {
      let setOffsetApartWord = (el) => {
        let pEl = el.offsetParent
        if(hasClass(pEl, 'auto-h-r')) {
          return el.offsetTop
        }

        let offsetT = el.offsetTop
        while(el = el.offsetParent) {
          if(hasClass(el, 'auto-h-r')) {
            return offsetT
          }
          offsetT+=el.offsetTop
        }
      }
      let h = !offsetH? el.clientHeight: setOffsetApartWord(el)+el.offsetHeight
      worder = setProperty(worder, name+ '.h', h)
      return worder
    },
    setH(worder) {
      let pages = getProperty(worder, ['m'])
      pages.map((page, pi) => {
        page.m.map((bp, i) => {
          if(bp.t === 'bp') {
            let className = `m.:${pi}.:m.:${i}$bp`
            let el = document.getElementsByClassName(className)[0]
            worder = options.setBpH(worder, el, `m.${pi}.m.${i}`)
          }
          if(bp.t === 'tb') {
            let ref = `m.:${pi}.:m.:${i}`
            worder = options.setTableH(
              worder,
              vm.$refs[ref].$el,
              `m.${pi}.m.${i}`, bp)
          }
        })
      })
      vm.worder = worder
    },
    // 检查表格
    inspectCompleted(tr, originNum) {
      let colNum = 0
      tr.map((td) => {
        colNum+=td.colspan
      })
      if(originNum> colNum) {
        return false
      }
      return true
    },
    switchPage() {
    },
    getH(el) {

      return el.clientHeight
    },
    returnH(bp, path, i) {
      let bpH = bp.h
      if(bp.h == 0) {
        let klass = (path+'.'+i).replace(/\./g, '.:')+'$bp'

        let el = document.getElementsByClassName(klass)[0]
        console.log(bp, path, i, klass, el)
        bpH = options.getH(el)
      }
      return (bp.h ? bp.h: bpH)
    },
    // 计算要补全的
    calcSupply(pageData, path, nextPageData) {
      let h = 0
      let maxH = pageData.operateH
      let page = pageData.m
      let nextPage = nextPageData.m
      for(let i = 0; i<page.length; i++) {
        let bp = page[i]
        if(bp.t === 'bp') {
          h+=options.returnH(bp, path, i)
        }
      }

      let delL = maxH-h
      console.log(delL, 'delL', h, page, '..........')
      if(delL) {
        let h = 0
        for(let i = 0;i<nextPage.length; i++) {
          let bp = page[i]
          if(bp.t === 'bp') {
            h+=options.returnH(bp, path, i)
          }
          if(h>delL) {
            console.log(i, '....yyy')
            // 添加部分
            return {
              supply: true,
              bpI: i-1 > 0 ? i-1: 0,
              l: nextPage.length
            }
          }
        }
        if(h<delL) {
          return {
            supply: true,
            bpI: nextPage.length-1,
            l: nextPage.length
          }
        }
      }
      return {
        supply: false,
        l: nextPage.length
      }

    },
    // 计算超出的位置
    calcOver(pageData, path) {
      let h = 0
      let maxH = pageData.operateH
      let page = pageData.m
      for(let i = 0; i< page.length; i++) {
        let bp = page[i]
        if(bp.t === 'bp') {
          h+=options.returnH(bp, path, i)
        }
        // 如果是table
        if(bp.t === 'tb') {
          let trs = bp.m
          for(let n = 0;n<trs.length;n++) {
            let tr = trs[n]
            h+=tr.h
            // console.log(h, 'hhhh')
            if(h>maxH) {
              let trI = n-1 <= 0 ? 0: n-1
              return {
                l: page.length,
                over: true,
                bpI: trI === -1? i-1: i,
                trI
              }
            }
          }
        }
        if(h>maxH) {
          return {
            l: page.length,
            over: true,
            bpI: i-1 > 0 ? i-1: 0
          }
        }
      }
      return {
        over: false,
        l: page.length
      }
    },

    /*
    * support: {
    * addSec: 添加部分数组对象,
    * i: 当前page序号,
    * delL: 需要删除的高度,
    * prev: 上一页序号
    * }
    * *
    /*
    * @autoBeautifyPage
    *
    *    // 新页伪方法
    * #func(addSec)
    *   addSec+originSec
    *   #if beyond
    *     #if next
    *        arguments callee
    *     #else
    *       new page
    *       arguments callee
    *   #else
    *     stop
    *     // 删除页伪方法
    * #func(delL, prev)
    *   $dec = #delSec(delL)
    *   #supply(prev, $dec)
    *   #if next
    *     arguments callee
    *   #else
    *     stop
    *
    *
    * **/
    // 错误做法 智能截取table
    intelligentSliceTable(data, pageI, {bpI, l, trI}) {
      // 这里做截取table操作
      /*
      * 根据trI截取出需要的
      * 检索截取的是否需要补全td
      * 把上面根据td里面的bp超出部分放到需要补全的盒子里面
      *
      * */
      // 删除掉要合并不包括table的
      let dataV2 = data
      let addSec = [];
      if(bpI<l-1) {
        let newVersion = supSplice(dataV2, `m.${pageI}.m`, bpI+1, l-bpI)
        addSec = newVersion['spliceData']
        dataV2 = newVersion['data']
        // addSec = getProperty(data, `m.${pageI}.m`).slice(bpI+1, l)
        // data = splice(data,`m.${pageI}.m`, bpI+1, l-bpI)
      }
      // 得到table数据
      let table = getProperty(dataV2, `m.${pageI}.m.${bpI}`)
      let trNum = table.m.length
      let tableV2 = supSplice(dataV2, `m.${pageI}.m.${bpI}.m`, trI+1>=trNum? trI: trI+1, trNum- trI)
      let interceptTrs =  tableV2['spliceData']
      dataV2 = tableV2['data']
      if(trNum <=1) {
        dataV2 = splice(dataV2, `m.${pageI}.m`, bpI, 1)
      }
      // 截取所有超出的trs
      // 无关的安全数据
      // table.m.splice(trI+1>=trNum? trI: trI+1, trNum- trI)
      //let interceptTrs = table.m.slice(trI+1>=trNum? trI: trI+1, trNum)
      // 移除要添加的
      // data = splice(data, `m.${pageI}.m.${bpI}.m`, trI+1>=trNum? trI: trI+1, trNum- trI)
      let firstTr = interceptTrs[0]
      firstTr['td'].map((td) => {
        let merge = td.merge
        if(merge.isMerge) {
          td.show = true
          td.colspan = merge.colspan
          td.rowspan = merge.rowspan
        }
      })
      let safeMergeData = options.intelligentMergeForTable(interceptTrs)
      //
      return {
        data: dataV2,
        sliceSec: [{fragmentI: pageI, interceptTrs: safeMergeData, type: 'tr_fragment' }, ...addSec]
      }
    },
    // 错误做法
    intelligentMergeForTable(trs) {
      let firstTr = trs[0]
      let otherTr = trs.slice(1, trs.length)
      otherTr.map((tr) => {
        tr['td'].map((td, tdi) => {
          let firstMatchTd = firstTr['td'][tdi]
          if(firstMatchTd.merge.isMerge&&td.merge.isMerge) {
            // 一样的隐藏掉
            if(firstMatchTd.merge.colspan === td.merge.colspan) {
              let colL = td.merge.colspan
              for(let col = 0;col< colL;col++) {
                tr['td'][tdi+(+col)].show = false
              }
            }
          }
        })
      })
      return trs
    },
    // 错误做法
    autoBeautifyPage: function(down, support, isMerge, doc) {
      // console.log(this.worder)
      let data = this.worder
      // 是否有下一页
      let hasNext = (data, i)=> {
        return getProperty(data, ['m']).length-1> i
      }
      // 合并页
      let merge = (data, pageI, addSec, down=true) =>{
        if(down) {
          return unshift(data, `m.${pageI}.m`, ...addSec)
        }else {
          return push(data, `m.${pageI}.m`, ...addSec)
        }

      }
      // 获得当前并且切割当前页 暂时 错误
      let getAddSrcAndSplice = (data, pageI, {bpI, l, trI})=> {
        // console.log(data.getIn(['m']), 'h是患得患失')
        // 截取table tri存在且不等于-1
        if(trI!==undefined&&trI!==-1) {
          let  sliceTable = options.intelligentSliceTable(
            data,
            pageI,
            {bpI, l, trI}
            )
          console.log(sliceTable['data'].getIn(['m']), sliceTable['sliceSec'], 'getAddSrcAndSplice')
          return {
            addSec: sliceTable['sliceSec'],
            data: sliceTable['data']
          }
        }
        // 暂时 错误
        let dataV2 = supSplice(data, `m.${pageI}.m`, bpI+1>=l? bpI: bpI+1, l-bpI)
        // data = dataV2['data']
        console.log(dataV2['data'].getIn(['m']), '5555')
        return {
          addSec: dataV2['spliceData'],
          data: dataV2['data']
        }
       // dataV2['spliceData']
        // return getProperty(data, `m.${pageI}.m`).splice(bpI+1>=l? bpI: bpI+1, l-bpI)
      }
      // 获取需要向上补全的并且切割当前 暂时 错误
      let getSupplySrcAndSplice = (data, pageI, {bpI}) => {
        let sec= getProperty(data, `m.${pageI}.m`).splice(0, bpI+1)
        console.log(getProperty(data, `m.${pageI}.m`), 'getProperty(data, `m.${pageI}.m`)')
        if(getProperty(data, `m.${pageI}.m`).length == 0) {
          getProperty(data, `m`).splice(pageI, 1)
        }
        return sec
      }
      // 是否处在当前编辑的
      let hasCurrEdit = (bpI, doc) => {
        if(!doc) return false;
        return bpI < doc.place.bpRelativeI;
      }
      // 节省计算资源的flag 如果doNoThing为true不在执行分页
      let doNoThing = false;
      // 当前编辑的地方 is 处于当前编辑
      let uEditPlace = {};
      let beautifyPage = new Function();
      (beautifyPage= down ?
        function (support, isMerge, doc) {

          // 超出部分
          let addSec = support['addSec'];
          // 没有合并先合并
          if(!isMerge) {

            // 合并页 错误
            if(addSec[0].type == 'tr_fragment') {
              // 当前表格
                let table = getProperty(data, `m.${support['i']}.m`)
              // 如果表格已被拆分过
                if(table.length&& table[0].t == 'tb'&& table[0]['fragmentI'] == addSec[0]['fragmentI']) {
                  data = unshift(data, `m.${support['i']}.m.0.m`, ...addSec[0]['interceptTrs'])
                  let table = getProperty(data, `m.${support['i']}.m`)
                  let newTrs = newArray(table[0]['m'])
                  newTrs = options.intelligentMergeForTable(newTrs)
                  data = setProperty(data, `m.${support['i']}.m.0.m`, newTrs)
                }else {
                  data = merge(data, support['i'], [
                    normalTb(addSec[0]['interceptTrs'], addSec[0]['fragmentI']),
                    ...addSec.slice(1, addSec.length)
                  ])
                }
            }else {
              data = merge(data, support['i'], addSec);
            }
            // support['addSec'] = getAddSrcAndSplice(data, support['i'], calcOver)
          }
          // 检查是否超出 // 计算超出
          let calcOver = options.calcOver(
            getProperty(data, `m.${support['i']}`),
            `m.${support['i']}.m`
          )
          // 如果已经是合并过检查是否需要去执行合并，over表示没超过，就不再执行事务
          if(isMerge) {
            calcOver.over || (doNoThing = true);
          }
          // 是否超出
          if(calcOver.over) {
            // 没有多的页就new一页
            console.log('超出了。。。。')
            if(!hasNext(data, support['i'])) {
              console.log('超出了。。。。没有下一页')
              data = options.newPage(data, support['i']);
            }
            let getAdd = getAddSrcAndSplice(data, support['i'], calcOver);
            addSec = getAdd['addSec']
            data = getAdd['data']
            //
            if(doc) {
              let has = hasCurrEdit(calcOver['bpI'], doc);
              if(has) {
                let i = support['i'];
                uEditPlace['is'] = true;
                uEditPlace['class'] = `m.:${++i}.:m.:0.:m.:0`;
              }
            }
            beautifyPage(
              {
                addSec,
                i: ++support['i']
              }
            )
          }else {
            return void 0;
          }
        }:
        function(support) {
          // 判断是否有下一页
          if(!hasNext(data, support['i'])) {
            doNoThing = true
            return void 0;
          }else {
            let currI = support['i']
            let nextI = currI+1
            let calcSupply = options.calcSupply(
              getProperty(data, `m.${currI}`),
              `m.${currI}.m`,
              getProperty(data, `m.${nextI}`)
            )
            if(calcSupply.supply) {
              let supplySec = getSupplySrcAndSplice(data, nextI, calcSupply)
              data = merge(data, currI, supplySec, false)
              beautifyPage({
                i: nextI
              })
            }else {
              doNoThing = true;
              return void 0;
            }
          }
        }
        // 以下参数不要修改
      )(support, isMerge, doc)
      history.record(data)
      console.log(data.getIn(['m']), 'dataend')
      return {
        data, doNoThing, uEditPlace
      }
    }.bind(vm),
    newPage(data) {
      return push(data, 'm', normalPage())
    },
    record: history.record.bind(history),
    Undo: history.Undo.bind(history),
    Redo: history.Redo.bind(history),
    history: history.history.bind(history)
  }
  return options
}
