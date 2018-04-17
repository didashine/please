//
// 一个文字在盒子里溢出形式的解决方案
// 经过测试400长度的文本运算耗时3~4ms，
//
import {_last} from "../until/until";

let compatible = function() {

}
/**
 * 返回一个对象记录了换行前当前行每个文本节点距离左侧的距离,和一个运算多行文本回车时每行是否溢出的方法
 * @param {*} relativeNode 当前行块的dom节点
 * @param {*} overNodes 当前行内块的dom节点数组
 */
export function calcLineRect(relativeNode, overNodes) {
  let FONT_RECT_X_ARR = [];
  // Element.getBoundingClientRect()方法返回元素的大小及其相对于视口的位置。
  let relativeRect = relativeNode.getBoundingClientRect();
  // 生成一个新的文本片段
  let range = new Range();

  // 整个循环对换行前行块内每个行小块的每个文本节点距离浏览器左侧的距离进行记录，不要多想🙂
  for(let nodeI = 0;nodeI< overNodes.length; nodeI++) {

    let overNode = overNodes[nodeI];
    // 拿到行内小块下的文本节点
    let txtNode = overNode.childNodes[0];
    if(txtNode === undefined) break;
    // 文本内容
    let txt = txtNode.textContent;
    let lastFontArr = _last(FONT_RECT_X_ARR);

    lastFontArr&&
    lastFontArr.push({node: overNode, rcArr: [], txt});
    // 设定一个包含节点和节点内容的 Range
    range.selectNode(txtNode);
    // 返回拥有和原 Range 相同端点的克隆 Range 对象。
    range = range.cloneRange();
    for(let i =0;i<= txt.length;i++) {
      // 可以想成把光标循环放到每个文本节点前
      range.setStart(txtNode, i);
      range.setEnd(txtNode, i);
      // 拿到位置属性
      let rect = range.getBoundingClientRect();
      // 每行push一个数组，每行中的每一个文本块为一个对象的格式，将当前行的所有单个文本节点横向属性存储
      if(rect.left - relativeRect.left <= 0) {
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

  /**
   * 当上一行被截下来之后，算出这一行需要截掉的部分
   * @param {*} totalW 行宽-上行被截下来的宽 = 当前行需要保留的宽度
   * @param {*} oneFontRXArr 当前行各个行小块位置记录的数组
   * @param {*} relativeRectX 当前行行首相对browser左侧距离
   */
  let over = (totalW, oneFontRXArr ,relativeRectX) => {
    oneFontRXArr = oneFontRXArr||FONT_RECT_X_ARR[0];
    relativeRectX = relativeRectX||relativeRect.left;
    let lastRectX = _last(_last(oneFontRXArr)['rcArr']);

    let over = {over: false}

    if(lastRectX- relativeRectX - totalW<=0) {
      return over
    }

    for(let nodeI = oneFontRXArr.length-1;nodeI>= 0; nodeI--) {
      // 倒序获取行小块对象
      let rectObj = oneFontRXArr[nodeI];
      // 行小块txt位置数组
      let rcArr = rectObj['rcArr'];
      // 该小块的txt内容
      let txt = rectObj['node'].innerText;

      for(let i = rcArr.length; i>= 0; i--) {
        let rectX = rcArr[i];
        if((+rectX- relativeRectX)<=totalW) {
          // 截取被挤到下一行的txt
          let interceptTxt = txt.substr(i, txt.length);
          interceptTxt = interceptTxt.trim() === '' ? '\u00A0': interceptTxt;
          let retainsTxt = txt.substr(0, i);
          retainsTxt = retainsTxt.trim() === '' ? '\u00A0': retainsTxt;
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
/* export let overflow = (relativeNode, overNodes, max) => {
 //  console.time('calcOver');
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
      rxArr.push(rect.left)
      // 换行模式
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
          }else {

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
        chunk,
        originI: nodeI
      }
      // overChunks.push(chunk);
      overChunks.push(chunkC)
    }

  }
  //console.log(overChunks, 'chunkC')
  // console.timeEnd('calcOver');
  return { overChunks, isOver: !!overChunks.length }
} */
/**
 *
 * @param {*} relativeNode 当前行小块节点
 * @param {*} overNodes 当前行小块节点和行小块节点后面的兄弟节点数组
 * @param {*} max 最大宽度
 */
export let _overflow = (relativeNode, overNodes, max) => {
  // debugger
  let overChunks = [];
  let range = new Range();
  // 当前行节点的坐标信息
  let relativeRect = relativeNode.getBoundingClientRect();
  // let relativeRx = relativeRect.left;
  let FONT_RECT_X_ARR = [];
  // 遍历它后面的兄弟节点
  for(let nodeI = 0;nodeI< overNodes.length; nodeI++) {
    let overNode = overNodes[nodeI];
    // text节点
    let txtNode = overNode.childNodes[0];
    if(txtNode === undefined) break;
    // text内容
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

      // 说明换行了
      if(rect.left- relativeRect.left<=0) {
        // 开辟一个记录字位置的数组
        // 表示换行模式下换行了
        FONT_RECT_X_ARR.push([{node: overNode, rcArr: []}]);
        // 如果是当前行小块后面的 小块节点或者小块节点的非第一个txt内容?
        if(nodeI>0||i-1>=0) {
          if (!chunk.length) {
            // 0~i-1 的txt
            let str = txt.substring(0, i);
            chunk.push({
              // 正在输入状态
              typewriting: true,
              str,
              originStr: txt,
              node: overNode,
              nodeI: nodeI,
              // 判断超出换行
              switchLine: false,
              startI: i
            })
          }

          // rxs = []
          chunk.push({
            typewriting: true,
            switchLine: nodeI===0&&i === 0? false: true,
            i: i-1,
            str: txt.substring(i, txt['length']),
            originStr: txt,
            node: overNode,
            nodeI: nodeI,
            startI: i
          });
          // console.log(i, chunk, 'hhh')
        }
      }
      let lastFontArr = _last(FONT_RECT_X_ARR);
      // debugger;
      lastFontArr&&
      (_last(lastFontArr)['rcArr']).push(rect.left);
    }
    // 置空
    // rxArr = [];
    if(chunk.length) {
      chunkC = {
        node: overNode,
        originStr: txt,
        fontRXArr: FONT_RECT_X_ARR,
        relativeRectX: relativeRect.left,
        chunk,
        nodeI: nodeI
      }
      // overChunks.push(chunk);
      overChunks.push(chunkC)
    }
  }
  // console.timeEnd('calcOver');
  // return overChunks;
  return {
    overChunks,
    eq: function(i) {
      return overChunks[i];
    },
    isOver: overChunks.length,
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
