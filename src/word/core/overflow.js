//
// 一个文字在盒子里溢出形式的解决方案
// 经过测试400长度的文本运算耗时3~4ms，
//
import {_last} from "../until/until";

let compatible = function() {

}
export function calcLineRect(relativeNode, overNodes) {
   let FONT_RECT_X_ARR = [];
   let relativeRect = relativeNode.getBoundingClientRect();
   let range = new Range();
   for(let nodeI = 0;nodeI< overNodes.length; nodeI++) {
     let overNode = overNodes[nodeI];
     // console.log(overNode, 'overNode')
     let txtNode = overNode.childNodes[0];
     if(txtNode === undefined) break;
     let txt = txtNode.textContent;
     let lastFontArr = _last(FONT_RECT_X_ARR);
     lastFontArr&&
     lastFontArr.push({node: overNode, rcArr: [], txt});
     range.selectNode(txtNode);
     range = range.cloneRange();
     for(let i =0;i<= txt.length;i++) {
       range.setStart(txtNode, i);
       range.setEnd(txtNode, i);
       let rect = range.getBoundingClientRect();
       // 换行模式
       if(rect.left- relativeRect.left<=0) {
         // 开辟一个记录字位置的数组
         // 表示换行模式下换行了
         FONT_RECT_X_ARR.push([{node: overNode, rcArr: [], txt}]);
       }
       let lastFontArr = _last(FONT_RECT_X_ARR);
       lastFontArr&&
       (_last(lastFontArr)['rcArr']).push(rect.left);
     }
   }
   /*
   *
   * font_rect_x_arr: [
   *  // 换行 只有一次的可能所以直接取0就好了
   *  [
   *   {node: #node, rcArr: []},
   *   {node: #node, rcArr: []}
   *  ],
   *  [
   *   {node: #node, rcArr: []},
   *   {node: #node, rcArr: []}
   *  ]
   * ]
   *
   * */
   let over = (totalW, oneFontRXArr ,relativeRectX) => {
     oneFontRXArr = oneFontRXArr||FONT_RECT_X_ARR[0];
     relativeRectX = relativeRectX||relativeRect.left;
     let lastRectX = _last(_last(oneFontRXArr)['rcArr']);
     let over = {over: false}
     if(lastRectX- relativeRectX - totalW<=0) {
       return {
         over: false
       }
     }
     for(let nodeI = oneFontRXArr.length-1;nodeI>= 0; nodeI--) {
       let rectObj = oneFontRXArr[nodeI];
       let rcArr = rectObj['rcArr'];
       let txt = rectObj['node'].innerText;
       for(let i = rcArr.length; i>= 0; i--) {
         let rectX = rcArr[i];
         if((+rectX- relativeRectX)<=totalW) {
           let interceptTxt = txt.substr(i, txt.length);
           interceptTxt = interceptTxt.trim() === '' ? '\u00A0': interceptTxt;
           let retainsTxt = txt.substr(0, i);
           retainsTxt = retainsTxt.trim() === '' ? '\u00A0': retainsTxt;
           // console.log(relativeRectX, 'relativeRectX', lastRectX, totalW)
           //let startOffset = i =0
           //if(lastRectX- rectX+ 630 === (630-totalW)+ 630) {
             console.log('%c%s', 'color: white;background: green;', lastRectX- rectX, i, interceptTxt)
           // }
           // console.log()
           return {
              over: true,
              startOffset: i,
              interceptTxt,
              retainsTxt,
              nodeIndex: nodeI,
              nodeNum: oneFontRXArr.length,
              overW: lastRectX- rectX
            };
           // break;
         }
       }
     }
    return over
   }
   return {
     fontRXArr: FONT_RECT_X_ARR,
     relativeRectX: relativeRect.left,
     oneFontRXArr: FONT_RECT_X_ARR[0],
     lastRectX: _last(_last(FONT_RECT_X_ARR[0])['rcArr']),
     over: (totalW, oneFontRXArr ,relativeRectX) => {
       return over(totalW, oneFontRXArr ,relativeRectX)
     }
   }
}
export let overflow = (relativeNode, overNodes, max) => {
  console.time('calcOver');
  let overChunks = [];
  let range = new Range();
  let relativeRect = relativeNode.getBoundingClientRect();
  let relativeRx = relativeRect.left;
  let FONT_RECT_X_ARR = [];
  for(let nodeI = 0;nodeI< overNodes.length; nodeI++) {
    let overNode = overNodes[nodeI];
    let txtNode = overNode.childNodes[0];
    if(txtNode === undefined) break;
    let txt = txtNode.textContent;
    let lastFontArr = _last(FONT_RECT_X_ARR);
    lastFontArr&&
    lastFontArr.push({node: overNode, rcArr: []});
    // 记录每个字的位置
    let rxArr = [];
    // 不是很想写上
    range.selectNode(txtNode);
    range = range.cloneRange();
    let chunk = [];
    let chunkC = {};
    // let first = false;
    for(let i =0;i<= txt.length;i++) {
      range.setStart(txtNode, i);
      range.setEnd(txtNode, i);
      let rect = range.getBoundingClientRect();
      // console.log(i, rect.left, 'rectx', range.getBoundingClientRect())
      rxArr.push(rect.left)
      // 换行模式
      // console.log(rect.left-relativeRect.left, relativeRect.left)
      if(rect.left- relativeRect.left<=0) {
        // 开辟一个记录字位置的数组
        // 表示换行模式下换行了
        FONT_RECT_X_ARR.push([{node: overNode, rcArr: []}]);
        // nodeI>0||i-1> 0
        // if(!overChunks.length&&nodeI>0) { first = true;}
        if(nodeI>0||i-1> 0) {
          let currChunk = chunk[chunk.length-1];
          if(currChunk) {
            currChunk.str = txt.substring(currChunk.i+1, i);
          }
          // rxs = []
          chunk.push({
            typewriting: true,
            i: i-1,
            str: txt.substring(i, txt['length']),
            originStr: txt,
            node: overNode,
            originI: nodeI
          });
        }
      }
      let lastFontArr = _last(FONT_RECT_X_ARR);
      // console.log(pushFonter, '...', pushFonter&&pushFonter[pushFonter.length-1])
      // debugger;
      lastFontArr&&
      (_last(lastFontArr)['rcArr']).push(rect.left);
      // 不换行模式
      // max*(chunk.length+1)
      // if(rect.x- relativeRx > max) {
      //   // i-1 表示那个超出的字的序号 i-2 表示超出的字的前面那个没超出的字的序号
      //   let currChunk = chunk[chunk.length-1];
      //   if(currChunk) {
      //     currChunk.str = txt.substring(currChunk.i+1, i-1);
      //   }
      //   chunk.push({
      //     i: i-2< 0 ? 0: i-2,
      //     originStr: txt,
      //     node: overNode,
      //     str: txt.substring(i-1, txt['length'])
      //   });
      //   relativeRx = rxArr[i-1];
      // }
    }
    // 置空
    // rxArr = [];
    if(chunk.length) {

      let firstChunk = chunk[0]
      // 第一个
      chunk.unshift({
        i: 0,
        originStr: txt,
        node: overNode,
        str: txt.substring(0, firstChunk.i+1)
      });

      chunkC = {
        node: overNode,
        originStr: txt,
        fontRXArr: FONT_RECT_X_ARR,
        relativeRectX: relativeRect.left,
        chunk
      }
      // overChunks.push(chunk);
      overChunks.push(chunkC)
    }

  }
  //console.log(overChunks, 'chunkC')
  console.timeEnd('calcOver');
  return { overChunks, isOver: !!overChunks.length }
}

export let _overflow = (relativeNode, overNodes, max) => {
  console.time('calcOver');
  let overChunks = [];
  let range = new Range();
  let relativeRect = relativeNode.getBoundingClientRect();
  let relativeRx = relativeRect.left;
  let FONT_RECT_X_ARR = [];
  console.log(overNodes, 'nodes')
  for(let nodeI = 0;nodeI< overNodes.length; nodeI++) {

    let overNode = overNodes[nodeI];
    let txtNode = overNode.childNodes[0];
    console.log(overNode, '.....node');
    if(txtNode === undefined) break;
    let txt = txtNode.textContent;
    let lastFontArr = _last(FONT_RECT_X_ARR);
    lastFontArr&&
    lastFontArr.push({node: overNode, rcArr: []});
    // 记录每个字的位置
    let rxArr = [];
    // 不是很想写上
    range.selectNode(txtNode);
    range = range.cloneRange();
    let chunk = [];
    let chunkC = {};
    // let first = false;
    for(let i =0;i<= txt.length;i++) {
      range.setStart(txtNode, i);
      range.setEnd(txtNode, i);
      let rect = range.getBoundingClientRect();
      rxArr.push(rect.left)

      // 换行模式
      if(rect.left- relativeRect.left<=0) {
        // 开辟一个记录字位置的数组
        // 表示换行模式下换行了
        FONT_RECT_X_ARR.push([{node: overNode, rcArr: []}]);
        // nodeI>0||i-1> 0
        // if(!overChunks.length&&nodeI>0) { first = true;}
        // if(nodeI>0||i-1> 0) {
          let currChunk = chunk[chunk.length-1];
          if(currChunk) {
            currChunk.str = txt.substring(currChunk.i+1, i);
          }else {
            let str = txt.substring(0, i);
            if(str!== '') {
              // console.log('....', 'push')
              // 推入没有换行的
              chunk.push({
                typewriting: true,
                str,
                originStr: txt,
                node: overNode,
                originI: nodeI,
                switchLine: false
              })
            }
          }
          console.log(overNode.textContent, 'youmeioyu')
          // rxs = []
          chunk.push({
            typewriting: true,
            switchLine: nodeI===0&&i === 0? false: true,
            i: i-1,
            str: txt.substring(i, txt['length']),
            originStr: txt,
            node: overNode,
            originI: nodeI
          });
          // console.log(i, chunk, 'hhh')
        // }
      }
      let lastFontArr = _last(FONT_RECT_X_ARR);
      // console.log(pushFonter, '...', pushFonter&&pushFonter[pushFonter.length-1])
      // debugger;
      lastFontArr&&
      (_last(lastFontArr)['rcArr']).push(rect.left);
      // 不换行模式
      // max*(chunk.length+1)
      // if(rect.x- relativeRx > max) {
      //   // i-1 表示那个超出的字的序号 i-2 表示超出的字的前面那个没超出的字的序号
      //   let currChunk = chunk[chunk.length-1];
      //   if(currChunk) {
      //     currChunk.str = txt.substring(currChunk.i+1, i-1);
      //   }
      //   chunk.push({
      //     i: i-2< 0 ? 0: i-2,
      //     originStr: txt,
      //     node: overNode,
      //     str: txt.substring(i-1, txt['length'])
      //   });
      //   relativeRx = rxArr[i-1];
      // }
    }
    // 置空
    // rxArr = [];
    console.log(chunk, 'chunk', overNodes)
    if(chunk.length) {
      chunkC = {
        node: overNode,
        originStr: txt,
        fontRXArr: FONT_RECT_X_ARR,
        relativeRectX: relativeRect.left,
        chunk
      }
      // overChunks.push(chunk);
      overChunks.push(chunkC)
    }

  }

  console.log(overChunks, 'chunkC')
  console.timeEnd('calcOver');
  // return overChunks;
  return {
    overChunks,
    isOver: (function(){
      // console.log('over', overChunks)
      if(overChunks.length<=0) return false;
      if(overChunks.length=== 1) {
        let overChunk = overChunks[0];
        let chunk = overChunk['chunk'];
        if(chunk.length === 1) {
          // console.log(chunk, '..dasd')
          return chunk[0]['switchLine'];
        }
        // console.log(overChunks[0]['chunk'], 'j')
        return true;
      }
      return true;
    }()),
    lastOverW: (function() {
      if(overChunks.length) {
        let lastChunk =  _last(overChunks);
        let fontRXArr = lastChunk['fontRXArr'];
        let lastArr = _last(fontRXArr);
        return +_last(_last(lastArr)['rcArr'])- (+lastChunk['relativeRectX']);
      }
    }())
  }
}
