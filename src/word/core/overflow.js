//
// 一个文字在盒子里溢出形式的解决方案
// 经过测试400长度的文本运算耗时3~4ms，
//
export default (relativeNode, overNodes, max) => {
  console.time('calcOver');
  let overChunks = [];
  let range = new Range();
  let relativeRect = relativeNode.getBoundingClientRect();
  let relativeRx = relativeRect.x;
  for(let nodeI = 0;nodeI< overNodes.length; nodeI++) {
    let overNode = overNodes[nodeI];
    let txtNode = overNode.childNodes[0];
    let txt = txtNode.textContent;
    // 记录每个字的位置
    let rxArr = [];
    // 不是很想写上
    range.selectNode(txtNode);
    range = range.cloneRange();
    let chunk = [];
    for(let i =0; i<=txt.length;i++) {
      range.setStart(txtNode, i);
      range.setEnd(txtNode, i);
      let rect = range.getBoundingClientRect();
      // 换行模式
      if(rect.x- relativeRect.x<=0) {
        if(nodeI>0||i-1> 0) {
          let currChunk = chunk[chunk.length-1];
          if(currChunk) {
            currChunk.str = txt.substring(currChunk.i+1, i);
          }
          chunk.push({
            typewriting: true,
            i: i-1< 0 ? 0: i-1,
            str: txt.substring(i, txt['length']),
            originStr: txt,
            node: overNode,
            originI: nodeI
          });
        }
      }
      // 不换行模式
      // max*(chunk.length+1)
      rxArr.push(rect.x)
      if(rect.x- relativeRx > max) {
        // i-1 表示那个超出的字的序号 i-2 表示超出的字的前面那个没超出的字的序号
        let currChunk = chunk[chunk.length-1];
        if(currChunk) {
          currChunk.str = txt.substring(currChunk.i+1, i-1);
        }
        chunk.push({
          i: i-2< 0 ? 0: i-2,
          originStr: txt,
          node: overNode,
          str: txt.substring(i-1, txt['length'])
        });
        relativeRx = rxArr[i-1];
      }
    }
    // 置空
    rxArr = [];
    if(chunk.length) {
      let firstChunk = chunk[0]
      chunk.unshift({
        i: 0,
        originStr: txt,
        node: overNode,
        str: txt.substring(0, firstChunk.i+1)
      });
      overChunks.push(chunk);
    }
  }
  console.timeEnd('calcOver');
  return overChunks;
}
