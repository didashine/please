import timeTraveler from '../until/timeTraveler'
import {newRow, edit, deleted, uStyle} from '../core/edit'
import {splice, newArray, push, setProperty, unshift, getProperty,replace, sliceMutable, supSplice} from "./immutable";
import {normalBp, normalTb,aloneBp, easyB, normalPage, normalTd} from "../core/core";
import {getTextNode, hasClass, getOffset, prevNode, byClass} from "../until/dom";
import {spliceMap, randomString, deepClone, _last} from '../until/until';
// import {}
import {calcLineRect } from '../core/overflow'
import {NORMAL_CONFIG} from "../config/baseConfig";
let t = true
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
export default function dataCenter(data, vm, eventBind) {
  let uid;
  let history = timeTraveler(12)
  history.record(data)
  let options = {
    // 唯一获取数据接口
    getData(worder, name) {
      return getProperty(worder, name)
    },
    bind(vms) {
      vm = vms
      return options
    },

    commit(commit, payload, exectedFn) {
      uid = randomString(18)
      let exec = {
        executed: exectedFn,
        afterExec: null
      }
      let v;
      let execReturn =(rs) => {
        if(typeof rs === 'boolean') {
          return {
            data: false
          }
        }
        return rs['data'] ? rs: {data: rs}
      }
      options['_beforeExec'](commit)
      if(options[commit]) {
        v = execReturn(options[commit].call(vm, payload))
      }else {
        throw new Error(`没有找到对应commit[${commit}]`)
      }
      let api = {
        _exec() {
          options['_executed'](commit, v)
          exec['executed']&&exec['executed'](v)
        },
        _afterExec() {
          exec['afterExec']&&exec['afterExec'](v)
        },
        nextTick(fn) {
          exec['afterExec'] = fn
        }
      }
      // 触发执行
      api._exec()
      // dom结束回调
      options['asyncDom'](() => {
        api._afterExec()
        options['_afterExec'](commit, v)
      })
      return api
    },
    _beforeExec() {

    },
    _executed(commit, v) {
      if(v['data']) {
        if(commit === 'autoBeautifyPage'&&v['doNoThing']) {
          return;
        }
        options.u(v['data'], commit, uid);
        eventBind.trigger('save', v['data']);
      }
    },
    _afterExec() {

    },
    fillInData(el, data, {name}) {
      if(hasClass(el, 'b_txt')) {
        let path = el.dataset.id
        data = setProperty(data, path+'.t_txt', `@{${name}}`)
      }
      history.record(data)
      return data
    },
    //
    // 居中
    ['textCenter']({doc, data, value}) {
      let bp = doc.place.bpAbsolutePath
      data = setProperty(data, bp+'.bpStyle'+'.textAlign', value)
      history.record(data)
      return data
    },
    ['set.bp.style']({doc, data, value, type}) {
      let bp = doc.place.bpAbsolutePath
      data = setProperty(data, bp+'.bpStyle.'+type, value)
      history.record(data)
      return data
    },
    // 设置样式
    ['uStyle']({doc, data, conf}) {
      // let update = uStyle(el, doc)
      // alert(JSON.stringify(data.toJS()))
      let place = doc.place;
      let range = doc.range;
      let line = getProperty(data, place.lineAbsolutePath+'.m')
      let currentLine = newArray(line);
      let disposeNode = currentLine[range.editNodeRelativeI];
      let currentEditNodeI = range.editNodeRelativeI;
      let spaceReg = /^\u00A0/g;
      let gen = [1, 0, 1];
      if((doc.getRetainsTxt().match(spaceReg)&&doc.getRetainsTxt().length<2)||doc.getRetainsTxt().trim() === '') {
        // 删除当前
        currentLine.splice(currentEditNodeI, 1);
        // 生成全新
        currentLine.splice(currentEditNodeI+1, 0, easyB(doc.getRetainsTxt(), conf))
        gen = [0, 1, 1]
      }
      if(doc.getInterceptTxt().match(spaceReg)||doc.getInterceptTxt().trim() === '') {
        gen[2] = 0
      }
      if(!gen[0]) {
        if(gen[2]) {
          currentLine.splice(currentEditNodeI+1, 0, {...disposeNode, t_txt: doc.getInterceptTxt()} )
        }
      }
      if(gen[0]) {
        // 修改当前的
        currentLine[currentEditNodeI].t_txt = doc.getRetainsTxt()
        // 生成新的
        currentLine.splice(currentEditNodeI+1, 0, easyB(undefined, conf))
        if(gen[2]) {
          currentLine.splice(currentEditNodeI+2, 0, {...disposeNode, t_txt: doc.getInterceptTxt()} )
        }
        // 补充

      }
      data = setProperty(data, place.lineAbsolutePath+'.m', currentLine);
      // let currAbPath = range.editNodeAbsolutePath.split('.').slice(0, -1);
      let currNodeAbPath = doc.getNodeLocation();
      let newEditElClass = currNodeAbPath+'.'+ (gen[0] ? currentEditNodeI+1: currentEditNodeI);
      data = setProperty(data, newEditElClass+'.s.heads', false)
      history.record(data)
      return {newEditElClass: newEditElClass, data}

      // <<<<<<<
      // let gep = getProperty(data, place.bpAbsolutePath+'.m')
      // let currentBp = newArray(gep)
      // let oldBp = currentBp[range.editNodeRelativeI]
      // let currentEditI = range.editNodeRelativeI
      // let spaceReg = /^\u00A0/g
      // let gen = [1, 0, 1]
      // // alert(JSON.stringify(currentBp))
      // if((doc.getRetainsTxt().match(spaceReg)&&doc.getRetainsTxt().length<2)||doc.getRetainsTxt().trim() === '') {
      //   // 删除当前
      //   currentBp.splice(currentEditI, 1)
      //   // 生成全新
      //   currentBp.splice(currentEditI+1, 0, easyB(doc.getRetainsTxt(), conf))
      //   gen = [0, 1, 1]
      // }
      // if(doc.getInterceptTxt().match(spaceReg)||doc.getInterceptTxt().trim() === '') {
      //   gen[2] = 0
      // }
      // if(!gen[0]) {
      //   if(gen[2]) {
      //     currentBp.splice(currentEditI+1, 0, {...oldBp, t_txt: doc.getInterceptTxt()} )
      //   }
      // }
      // if(gen[0]) {
      //   // 修改当前的
      //   currentBp[currentEditI].t_txt = doc.getRetainsTxt()
      //   // 生成新的
      //   currentBp.splice(currentEditI+1, 0, easyB(undefined, conf))
      //   if(gen[2]) {
      //     currentBp.splice(currentEditI+2, 0, {...oldBp, t_txt: doc.getInterceptTxt()} )
      //   }
      //   // 补充
      //
      // }
      // data = setProperty(data, place.bpAbsolutePath+'.m', currentBp)
      // let currAbPath = range.editNodeAbsolutePath.split('.').slice(0, -1)
      // let newEditElClass = currAbPath.join('.')+'.'+ (gen[0] ? currentEditI+1: currentEditI)
      // data = setProperty(data, newEditElClass+'.s.heads', false)
      // history.record(data)
      // return {newEditElClass: newEditElClass, data}
    },

    ['height.determination']({doc, page, pageI}) {
      let max = 0;
      let h = 0;
      let bps = page[pageI]['m']
      for(let bpi = 0; bpi<bps.length; bpi++) {
        let bp = bps[bpi]
        if(bp['type'] === 'bp') {
          h+= parseInt(bp['bpStyle']['height'])
        }
        // 检查表格哪一格超出了
        if(bp['type'] === 'tb') {
          let ref = `m.${pageI}.m.${bpi}`;
          let table = vm['$refs'][ref];
          let trs = table.getElementsByTagName('tr');
          for(let tri = 0; tri< trs.length; tri++) {
            let tr = trs[tri]
            h+= tr.clientHeight
            // 超出的话就对该行的所有bp进行遍历
            if(h>max) {
              for(let tdi = 0; tdi< tdi.length; tdi++) {

              }
            }
          }
        }
      }
    },

    ['newTable']({selTable, doc, data, conf}) {

      let path = doc.place.bpAbsolutePath.split('.').slice(0, -1)
      data = splice(data, path, doc.place.bpRelativeI+1, 0, normalTb(...selTable, conf))
      history.record(data)
      return {
        bpPath: path.join('.')+'.'+(doc.place.bpRelativeI+2),
        path: path.join('.')+'.'+(doc.place.bpRelativeI+1),
        data: splice(data, path, doc.place.bpRelativeI+2, 0, normalBp(conf))}
    },
    // 一个获取该行每个字的左位置
    getEveryFontRectX(relativeNode, overNodes) {
      // let overflow = new Function()
      // let fontRXArr = overflow(relativeNode, overNodes, 600)['fontRXArr']

    },
    ['txt.patch']({data, supplement, path}) {
      // console.log(supplement)
      let last = _last(supplement);
      if(last['patchCode'] === '') {
        last['patchCode'] = randomString(9);
      }
      // let line = getProperty(data, path)
      // let first = line[0];
    },
    ['txt.merge']({data, supplement, path}) {
      let isMerge = false;
      let line = getProperty(data, path);
      let last = _last(supplement);
      console.log(path, line, 'line', data.getIn(['m', 0, 'm', 0, 'm']).length)

      let first = line[0];
      // console.log(last['patchCode'], first['patchCode'])
      if(last['patchCode']&&first['patchCode'] === last['patchCode']) {
        // console.log('是否一样')
        let dataV2 = supSplice(data, path, 0, 1)
        let spliceData = dataV2['spliceData'];
        // console.log(spliceData, path, 'merge.t')
        data = dataV2['data'];
        let spliceStr = spliceData[0]['t_txt'];
        console.log(spliceStr, 'spliceStr')
        last['t_txt']+= (isSpaceTxt(spliceStr) ? '': spliceStr);
        isMerge = true;
      }
      return {data, isMerge};
    },
    // 用于补全编辑 接受一个多余的需要补全的编辑对象supplement，超出的宽度overW，补全的相对位置
    ['auto.space']({data, doc, lineRelativeI, overW, surplusNum, supplement}) {

      console.log( data.getIn(['m', 0, 'm', 0, 'm']).length)
      // console.log(surplusNum, supplement, 'supplement')
      let _merge = (originData, path, merge) => {
        console.log(JSON.parse(JSON.stringify(merge)), '.zhiduiziji')
        options['txt.patch']({data: originData, supplement: merge, path})
        // 合并处理 他说处理merge
        let txtMerge = options['txt.merge']({data: originData, supplement: merge, path});
        originData = txtMerge['data'];
        let txtIsMerge = txtMerge['isMerge'];

        // console.time('merge')
        // console._log({ lineD: originData.getIn(['m', 0, 'm', 0, 'm']), merge})
        // console.timeEnd('merge')
        // console.log('_merge', originData.getIn(['m', 0, 'm', 0, 'm']), merge)
        return { txtIsMerge, data: unshift(originData, path, ...merge)};
      };
      // 拿到需要换算的下一行数据
      let lineLocation = doc.getLineLocation();
      let nextLineRelativeI = doc.place.lineRelativeI+1;
      let needNew = false;
      // console.time('zhe')
      for(let i = 0; i< surplusNum; i++, nextLineRelativeI++, lineRelativeI++) {
        // >>>>>>>>>>>
        let nextLineClass = lineLocation+ "."+nextLineRelativeI;
        let lineNode = document.getElementsByClassName(nextLineClass)[0];
        // console.time('sunhao')
        let chunkC = calcLineRect(lineNode, [...lineNode.childNodes]);
        let over = chunkC['over'](630- overW);
        let slice;
        if(over['over']){
          // 切割完后
          slice = options['splice.line']({doc, data,
            customDoc: {
              // 当前行的绝对位置
              lineAbsolutePath: lineLocation+'.'+lineRelativeI,
              // 编辑dom的相对位置
              editNodeRelativeI: over['nodeIndex'],
              // 行的总子dom数
              lineNodeNum: over['nodeNum'],
              // 要切割的文本(超出的那个dom)
              interceptTxt: over['interceptTxt'],
              // 保留的文本(超出的那个dom)
              retainsTxt: over['retainsTxt']
            }})
          data = slice['data'];
        }
        // <<<<<<<<<<<
        // 合并
        // >>>>>>>>>>>.
        let mergeData = _merge(data, lineLocation+'.'+lineRelativeI+ '.m', supplement)
        //console.timeEnd('merge')
        data = mergeData['data'];
        if(!over['over']) break;
        supplement = slice['sliceIntercept'];
        if(i === surplusNum- 1) { needNew = true};
        overW = over['overW'];
        // console.log(overW, supplement, 'supplement')
      }
      // console.timeEnd('zhe')
      if(needNew) {
        data = options['push.line']({
          data,
          path: lineLocation,
          line: {m: supplement, t: 'line'}
        })

      }
        return data;
      // 下一行数据

    },
    ['auto.white.space']({data, doc, over, conf, nowrap = false}) {
      // return data;
      // let endStr;
      // let endLineNodePath;
      data = options['edit']({undefined, doc, data})['data'];

      let spliceSec = [];
      // 当前段落序号
      let lineRelativeI = doc.place.lineRelativeI;
      let overChunks = over['overChunks'];

      console.log(overChunks, 'overChunks')
      // // // 当前段落路径
      // let lineAbsolutePath = doc.place.lineAbsolutePath;
      // // // 当前要处理的节点下标
      // let editNodeRelativeI;



      // >>>>>>>>>>>>>
      // console.time('start')
      // 最后超出宽度
      let overW = over['lastOverW'];
      let surplusNum = getProperty(data, doc.place.bpAbsolutePath+'.m').length- 1- doc.place.lineRelativeI;
      // console.log(surplusNum, overChunks, 'Y');
      let lineLocation = doc.getLineLocation();
      // 相对于在当前处理行的超出节点序号
      let ONI_IN_CURRLINE;
      // 相对于在编辑时就记录的超出节点序号
      let ONI_IN_EDIT;
      // 需要处理的node绝对路径
      let disposeNodeAbsolutePath;
      // 需要处理的line绝对路径
      let disposeLineAbsolutePath
      let flexibleCursor = (overChunk, originOffsetStart) => {
        console.log(originOffsetStart);
        // let offsetStart = 0;
        for(let ci= 0; ci< overChunk['chunk'].length; ci++) {
          let chunk = overChunk['chunk'][ci];
          let lastChunk = overChunk['chunk'][ci+ 1];
          if((lastChunk&&lastChunk['startI'] > originOffsetStart) || !lastChunk) {
            return { start: originOffsetStart- chunk['startI'], i: ci}
          }
        }
      }

      // ['txt.merge']({data, supplement, path})
     // console.time('care')
      for(let i = 0; i< overChunks.length; i++) {
        // console.log('xuhanddd')
        let overChunk = overChunks[i];
        let chunk = overChunk['chunk'];
        let node = overChunk['node'];
        // 当前要处理的， 如果ONI_IN_EDIT为空直接取否则就是ONI_IN_EDIT-当前的
        ONI_IN_CURRLINE = ONI_IN_EDIT === undefined?
          +node.dataset.index: +node.dataset.index- ONI_IN_EDIT;
        ONI_IN_EDIT = +node.dataset.index;
        disposeNodeAbsolutePath = `${lineLocation}.${lineRelativeI}.m.${ONI_IN_CURRLINE}`;
        // console.log(disposeLineAbsolutePath, lineLocation, lineRelativeI, ONI_IN_CURRLINE)
        disposeLineAbsolutePath = `${lineLocation}.${lineRelativeI}`
        let lineNodeNum = getProperty(data, disposeLineAbsolutePath+ '.m').length;
        // 移除掉的node个数
        let spliceNum = lineNodeNum-1 - (ONI_IN_CURRLINE);
        let dataV2;
        // 删除后面多余的
        if(spliceNum> 0) {
          dataV2 = supSplice(
            data,
            disposeLineAbsolutePath+ '.m',
            ONI_IN_CURRLINE+1,
            spliceNum
          )
          data = dataV2['data'];
          // console.log(dataV2['spliceData'][0].t_txt, 't')
        }
        // 处理code

        let nodeData = getProperty(data, disposeNodeAbsolutePath);
        console.log(disposeLineAbsolutePath, 'dispose', nodeData)
        let patchCode = nodeData['patchCode'];
        let code = patchCode === '' ? randomString(9): patchCode;
        let needDelNode = {
          disposeLineAbsolutePath: '',
          ONI_IN_CURRLINE: '',
          is: false
        }
        chunk.map(ck => {
          if(!ck['switchLine']) {
            if(ck.str === '') {
              console.log(ck, 'ck...')
              needDelNode = {
                disposeLineAbsolutePath,
                ONI_IN_CURRLINE,
                is: true
              }
              // 等待
              // data = splice(data, disposeLineAbsolutePath, ONI_IN_CURRLINE, 1)
            }

            // 设置文本
            data = setProperty(
              data,
              disposeNodeAbsolutePath+'.t_txt',
              ck.str);
            // 设置code
            data = setProperty(
              data,
              disposeNodeAbsolutePath+'.patchCode',
              code);

          }else {
            let bp = getProperty(data, doc.place.bpAbsolutePath);
            let bpTxt = getProperty(data, disposeNodeAbsolutePath);
            // console.log(bp, bpTxt, 'bpTxt')
            conf = {bp: {...bp['bpStyle']}, bpTxt: {...bpTxt['s']}};
            // 要新添加行，++切换
            lineRelativeI++;
            data = options['insert.line']({
              data,
              path: doc.getLineLocation(),
              index: lineRelativeI,
              bpAbsolutePath: doc.place.bpAbsolutePath,
              txt: ck.str,
              conf, patchCode: code})
          }
        })
        // console.log(data.getIn(['m', 0, 'm', 0]))
        if(needDelNode.is) {
          console.log(needDelNode, 'needDelNode')
          console.log(data.getIn([...needDelNode.disposeLineAbsolutePath.split('.'), 'm', needDelNode.ONI_IN_CURRLINE]))
          data = splice(data, needDelNode.disposeLineAbsolutePath+'.m', needDelNode.ONI_IN_CURRLINE, 1)
        }
        // 把删除的补上
        if(spliceNum> 0) {
          spliceSec = dataV2['spliceData'];
          if(spliceSec.length) {
            data = push(data, `${lineLocation}.${lineRelativeI}.m`, ...spliceSec);
          };
        }


      }
      // console.timeEnd('care')
      if(surplusNum>0) {
        let spliceDataV2 = supSplice(data, doc.getLineLocation(), lineRelativeI, 1);
        data = spliceDataV2['data'];
        let supplement = spliceDataV2['spliceData'][0]['m'];
        // alert(supplement[0].t_txt)
        data = options['auto.space']({data, doc, lineRelativeI, supplement, overW, surplusNum})
      }
     // console.timeEnd('start')
      // <<<<<<<<<<<<<
      // 光标定位处理
      // 第一次段落分行后的下标
      // let
      lineRelativeI = overChunks[0]['chunk'].length+ doc.place.lineRelativeI;
      // 第一次段落分行后的行路径
      let endLineNodePath = `${doc.getLineLocation()}.${lineRelativeI}.m.0`;
      // console.log(lineRelativeI, endLineNodePath);
      // 表示当前编辑的node被分行了
      let cursor = { change: false, start: 0, i: 0} ;
      if(over.eq(0).nodeI === 0) {
        cursor = { change: true, ...flexibleCursor(over.eq(0), doc.startOffset)} ;
      }
      return {
        data,
        changeCursor: cursor['change'],
        nodePath: `${doc.getLineLocation()}.${doc.place.lineRelativeI+ cursor['i']}.m.0`,
        start: cursor['start']}
    },
    // 插入一行
    ['insert.line']({data, path, txt, conf, index, patchCode}) {
      // let normalBpBt = normalBp(conf, txt)['m']
      data = splice(data, path, index, 0, aloneBp(conf, txt, patchCode))
      return data
    },
    // 添加一行
    ['push.line']({data, path, line}) {
      return data = push(data, path, line)
    },
    ['fragment.interception']({path, i, num}) {
      let sliceIntercept = sliceMutable(
        data,
        path,
        i,
        num
      )
      return sliceIntercept
    },
    ['splice.line']({doc, data, customDoc }) {
      console.log(customDoc)

      // 当前行
      // 在当前行当前编辑node 表示到新行的数据
      let sliceIntercept = sliceMutable(
        data,
        customDoc.lineAbsolutePath+'.m',
        customDoc.editNodeRelativeI,
        customDoc.lineNodeNum
      )

      // console.log(sliceIntercept, 'sliceIntercept', customDoc, getProperty(data, customDoc.lineAbsolutePath+'.m'))
      sliceIntercept[0].t_txt = customDoc.interceptTxt
      // -----------------
      // 如果当前行开头存在莫名的空格，将其移除
      spliceMap(sliceIntercept, (b, i) => {
        if(isSpaceTxt(b.t_txt)) {
          sliceIntercept.splice(i, 1)
          return true
        }
      })

      // 设置当前行保留下来的数据
      let sliceRetains = sliceMutable(data, customDoc.lineAbsolutePath+'.m', 0, customDoc.editNodeRelativeI+1);

      sliceRetains[sliceRetains.length-1].t_txt = customDoc.retainsTxt;
      data = setProperty(data, customDoc.lineAbsolutePath+'.m', sliceRetains);
      // m.?.m
      // 切割完了之后
      sliceRetains.map((s) => {
        if(s['t_txt'] === '') {
          // alert('hhhhsdfasdfasjdfkasjdfasjdfasdjfasjdfajdfdsasdfasdf')
        }
      })
      return {sliceIntercept, data, sliceRetains}
    },
    ['newRow']({el, doc, data, conf}) {
      let nodeClass = doc.place.lineAbsolutePath;
      let lineNode = document.getElementsByClassName(nodeClass)[0];
      // console.log(nodeClass, '...', lineNode.childNodes)
      let _lineRect = calcLineRect(lineNode, lineNode.childNodes);
      let _oneFontRXArr = _lineRect['fontRXArr'][0];
      let nodeRelativeI = doc.range.editNodeRelativeI;
      let startOffset = doc.range.startOffset;
      let overW = +_lineRect['lastRectX']- _oneFontRXArr[nodeRelativeI]['rcArr'][startOffset];
      console.log(overW, 'overW')
      // 切割完了之后
      // console.log(doc.place, 'place', doc.range)
      let slice = options['splice.line']({doc, data,
        customDoc: {
        // 当前行的绝对位置
        lineAbsolutePath: doc.place.lineAbsolutePath,
        // 编辑dom的相对位置
        editNodeRelativeI: doc.range.editNodeRelativeI,
        // 行的总子dom数
        lineNodeNum: doc.getLineNodeNum(),
        // 要切割的文本(超出的那个dom)
        interceptTxt: doc.getInterceptTxt(),
        // 保留的文本(超出的那个dom)
        retainsTxt: doc.getRetainsTxt()
        }})
      let supplement = slice['sliceIntercept'];
      // console.log(supplement[0].t_txt, 'suple')
      data = slice['data'];
      let surplusNum = getProperty(data, doc.place.bpAbsolutePath+'.m').length- 1- doc.place.lineRelativeI
      let newBp = normalBp(conf)

      if(surplusNum>0) {
        // console.log(overW, JSON.parse(JSON.stringify(supplement)), surplusNum, doc.place.lineRelativeI+1)
        data = options['auto.space']({data, doc, lineRelativeI: doc.place.lineRelativeI+1, supplement, overW, surplusNum});
        let dataV2 = supSplice(data, doc.getLineLocation(), doc.place.lineRelativeI+1, surplusNum+1);
        data = dataV2['data'];
        let spliceData = dataV2['spliceData'];
        newBp.m = spliceData
      }else {
        supplement.length>0 ?(newBp.m[0]['m'] = supplement) : newBp.m[0]['m'].push(...supplement)
      }
      data = splice(data, doc.getBpLocation(), doc.place.bpRelativeI+1, 0, newBp)


      history.record(data)
//
      return { data, nextLinePath: doc.getNextBpPath()+'.m.0'}
    },
    // 需要切换node 此时startOffset为1或者0
    ['delete.switch']({el, doc, data}) {
      let place = doc.place
      let range = doc.range
      let i = doc.range.editNode.dataset.index
      let interceptTxt = doc.getInterceptTxt()
      data = setProperty(data, range.editNodeAbsolutePath+'.t_txt', interceptTxt)
      // 后面没有了删除节点
      if(doc.getTxt().length<=1&&doc.getBpNodeNum()>1) {
        data = splice(data, place.bpAbsolutePath+'.m', range.editNodeRelativeI, 1)
      }
      let toZero = false
      if(+i===0&&+doc.startOffset === 1) {
        toZero = true
      }
      return { data, prevNodePath: doc.range.editNodeRelativeI>=1&&doc.getPrevNodePath(), toZero}
    },
    ['delete.removeRow']({el, doc, data}) {
      let place = doc.place
      let range = doc.range
      let sliceInterceptTxt = sliceMutable(data, place.bpAbsolutePath+'.m', range.editNodeRelativeI , doc.getBpNodeNum())
      sliceInterceptTxt[0].t_txt = doc.getInterceptTxt()
      // 删除空的文本
      spliceMap(sliceInterceptTxt, (b, i) => {
        if(isSpaceTxt(b.t_txt)) {
          sliceInterceptTxt.splice(i, 1)
          return true
        }
      })
      let pages = getProperty(data, 'm')
      let prevBpPath = doc.getPrevBpPath(pages)
      let prevBpNodePath = '';
      let isZero = false
      if(prevBpPath) {

        let prevBpData = getProperty(data, prevBpPath+'.m')
        if(prevBpData.length === 1&&isSpaceTxt(prevBpData[0].t_txt)) {
          // data = setProperty(data, prevBpPath+ '.m', [])
          prevBpNodePath = prevBpPath+ '.m'+'.0'
          isZero = true
        }else {
          prevBpNodePath = prevBpPath+'.m.'+(prevBpData.length-1)
        }
      }else {
        return false
      }

      data = push(data, prevBpPath+'.m', ...sliceInterceptTxt)
      data = splice(data, doc.getBpLocation(), place.bpRelativeI, 1)
      return {data, isZero, prevBpNodePath}
    },
    //
    ['edit']({el, doc, data}) {
      data = setProperty(
        data,
        doc.range.editNodeAbsolutePath+'.t_txt',
        doc.range.editTxtNode.textContent)
      history.record(data)
      return {data}
    },
    // 数据更新统一接口
    update: function(data) {
      this.worder = data
    }.bind(vm),
    // 快捷
    u: function(data, commit, psd) {
      if(psd!==uid) {
        console.warn(
          (commit=== undefined ? '未知处理commit': commit)+'没有正确提交， 数据被私自修改，不是来自commit')
      }
      console.log('%c%s', 'color: green', '【'+commit+'】'+'commit', psd)
      options.update(data)
      return data
    }.bind(vm),
    //
    asyncDom: function(fn) {
      this.$nextTick(() => {
        fn.call(this)
      })
    }.bind(vm),
    ['setTableH']({data, el, path, bp}) {
      let trDom = el.getElementsByTagName('tr')
      let trData = bp? bp.m: getProperty(data, path).m
      trData.map((tr, tri) => {
        data = setProperty(
          data,
          `${path}.m.${tri}.h`,
          trDom.item(tri).clientHeight)
        tr['td'].map((td, tdi) => {
          if(td.show) {
            td['t_bp'].map((tbp, tbpi) => {
              if(!tbpi['h']) {
                let klass = `${path}.m.${tri}.td.${tdi}.t_bp.${tbpi}`+ '$bp'
                data = options['setBpH']({
                  data,
                  el: document.getElementsByClassName(klass)[0],
                  name: `${path}.m.${tri}.td.${tdi}.t_bp.${tbpi}`,
                  offsetH: true
                })
              }
            })
          }
        })
      })
      return data
    },
    ['setTr']({data, el, name}) {
      let h = el.clientHeight
      data = setProperty(data, name+'.h', h)
      return data
    },
    setOffsetApartWord (el) {
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
      // return offsetT
    },
    ['setBpH']({data, el, name, offsetH = false}) {
      let h = !offsetH? el.clientHeight: options.setOffsetApartWord(el)+el.offsetHeight
      data = setProperty(data, name+ '.h', h)
      return data
    },
    ['setH']({data}) {
      let pages = getProperty(data, ['m'])
      pages.map((page, pi) => {
        page.m.map((bp, i) => {
          if(bp.t === 'bp') {
            let className = `m.${pi}.m.${i}$bp`
            let el = document.getElementsByClassName(className)[0]
            data = options['setBpH']({data, el, name: `m.${pi}.m.${i}`})
          }
          if(bp.t === 'tb') {
            let ref = `m.${pi}.m.${i}`
            data = options['setTableH'](
              {
                data,
                el: vm.$refs[ref].$el,
                path: `m.${pi}.m.${i}`,
                bp
              })
          }
        })
      })
      return data
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
        let klass = (path+'.'+i)+'$bp'
        let el = document.getElementsByClassName(klass)[0]
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
      if(delL) {
        let h = 0
        for(let i = 0;i<nextPage.length; i++) {
          let bp = page[i]
          if(bp.t === 'bp') {
            h+=options.returnH(bp, path, i)
          }
          if(h>delL) {
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
            if(h>maxH) {
              // tr['td']
              tr['td'].map((td, tdi) => {
                if(td.show) {
                  td['t_bp'].map((bp, bpi) => {
                    // let v = `${path}.${i}.m.${n}.td.${tdi}.t_bp.${bpi}`
                    // let klass = v.replace(/\./g, '.:')
                    // let offsetH = options.setOffsetApartWord(document.getElementsByClassName(klass)[0])
                    if(bp.h>maxH) {

                    }
                  })
                }
              })
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
    ['intelligent.line']({bp}) {


    },
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
    ['autoBeautifyPage']: function({down, support, isMerge, doc}) {
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
        // 截取table tri存在且不等于-1
        if(trI!==undefined&&trI!==-1) {
          let  sliceTable = options.intelligentSliceTable(
            data,
            pageI,
            {bpI, l, trI}
            )
          return {
            addSec: sliceTable['sliceSec'],
            data: sliceTable['data']
          }
        }
        // 暂时 错误
        let dataV2 = supSplice(data, `m.${pageI}.m`, bpI+1>=l? bpI: bpI+1, l-bpI)
        // data = dataV2['data']
        return {
          addSec: dataV2['spliceData'],
          data: dataV2['data']
        }
       // dataV2['spliceData']
        // return getProperty(data, `m.${pageI}.m`).splice(bpI+1>=l? bpI: bpI+1, l-bpI)
      }
      // 获取需要向上补全的并且切割当前 暂时 错误
      let getSupplySrcAndSplice = (data, pageI, {bpI}) => {
        // let sec= getProperty(data, `m.${pageI}.m`).splice(0, bpI+1)
        let sectionV2 = supSplice(data, `m.${pageI}.m`, 0, bpI+1)
        let dataV2 = sectionV2['data']
        if(getProperty(dataV2, `m.${pageI}.m`).length == 0) {
          let sectionV3 = supSplice(data, `m`, pageI, 1)
          dataV2 = sectionV3['data']
        }
        return {
          supplySec: sectionV2['spliceData'],
          data: dataV2
        }
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
            if(!hasNext(data, support['i'])) {
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
                uEditPlace['class'] = `m.${++i}.m.0.m.0`;
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
        function(support, isMerge, doc) {
          // 判断是否有下一页
          if(!hasNext(data, support['i'])) {
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
              let supply = getSupplySrcAndSplice(data, nextI, calcSupply)
              data = merge(supply['data'], currI, supply['supplySec'], false)
              beautifyPage({
                i: nextI
              })
            }else {
              return void 0;
            }
          }
        }
        // 以下参数不要修改
      )(support, isMerge, doc)
      history.record(data)
      return {
        data, doNoThing, uEditPlace
      }
    }.bind(vm),
    newPage(data) {
      return push(data, 'm', normalPage())
    },
    record: history.record.bind(history),
    //Undo: history.Undo.bind(history),
    Undo(){
      // t = false
      return history.Undo()
      // options.asyncDom(() => {
      //   t = true
      // })
    },
    Redo: history.Redo.bind(history),
    history: history.history.bind(history)
  }
  return options
}
