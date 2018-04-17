export const { Map, getIn, setIn, List} = require('immutable')
export const setProperty = function (obj, name, value) {
  return obj.setIn(typeof name === 'string'? name.split('.'): name, value)
}

export const getMutable = function(obj, name) {
  name = typeof name === 'string'? (name + '').split("."): name;
  for(var i = 0; i < name.length - 1; i++) {
    obj = obj[name[i]];
    if(typeof obj != "object" || !obj) return;
  }
  return obj[name.pop()];

}

export const newArray = (o) => {
  return List(o).toJS()
}

export const getProperty = function (obj, name) {
  return getIn(obj, typeof name === 'string'? name.split('.'): name)
}
export const push = function(obj, name, ...value) {
  name = typeof name === 'string'? name.split('.'): name
  return obj.updateIn(name, (x) => {
    let n = List(x).toJS()
    console.log(value, n, 'hheleo')
    n.push(...value)
    return n
  })
}
export const unshift = function(obj, name, ...value) {
  // let o = getIn(obj, typeof name === 'string'? name.split('.'): name)
  // let newArr = newArray(o)
  // newArr.unshift(...value)
  // o.unshift(...value)

  name = typeof name === 'string'? name.split('.'): name
  // console.log(getProperty(obj, name.slice(0, -2)), name)
  return obj.updateIn(name, (x) => {
    let n = List(x).toJS()
    n.unshift(...value)
    return n
  })
  // return obj.setIn(typeof name === 'string'? name.split('.'): name, newArr)
}
export const splice = function(obj, name, i, num, data) {
  // let o = obj.getIn(typeof name === 'string'? name.split('.'): name)
  //
  // data === undefined ? o.splice(i, num): o.splice(i, num, data)
  // return obj.setIn(typeof name === 'string'? name.split('.'): name, o)
  name = typeof name === 'string'? name.split('.'): name
  return obj.updateIn(name, (x) => {
    let n = List(x).toJS()
    data === undefined ? n.splice(i, num): n.splice(i, num, data)
    return n
  })
  // obj.splice(['0', ...name.split('.')], value)
}
export const last = function() {

};
export const supSplice = function (obj, name, i, num, data) {
  name = typeof name === 'string'? name.split('.'): name
  let spliceData;
  let objV2 = obj.updateIn(name, (x) => {
    let n = List(x).toJS()
    spliceData = data === undefined ? n.splice(i, num): n.splice(i, num, data)
    return n
  })
  return {
    data: objV2,
    spliceData
  }
}
/**
 * @description 将准备切割的行小块变成可变的(非Map)的数据结构
 * @param {*} obj 数据map对象
 * @param {*} name 当前行路径（类m.0.m.1.m.0.m） 用于找到当前行块m的的数组内容
 * @param {*} begin 当前编辑的行小块index
 * @param {*} end 当前行小块总数量
 */
// 1 4
export const sliceMutable = function(obj ,name, begin, end) {
  // 当前行块在数据结构中对应的数组
  let o = obj.getIn(typeof name === 'string'? name.split('.'): name)
  end = end == -1? o.length: end
  return end === undefined ? List(o.slice(parseInt(begin))).toJS(): List(o.slice(parseInt(begin), parseInt(end))).toJS()
}

export const setMutable = function(obj, name, value) {
    name = typeof name === 'string'? name.split('.'): name
    for(var i = 0; i < name.length - 1; i++) {
      if(typeof (obj[name[i]]) !== "object" || !obj[name[i]]) obj[name[i]] = {};
      obj = obj[name[i]];
    }
    obj[name.pop()] = value;
//
}
// 截取替换
export const replace = function(v) {
  return v.replace(/:/g, '')
}

// 取最大
export const mined = function(arr) {
  let min = arr[0]
  let minI = 0
  for(let i=0;i< arr.length;i++) {
    if(min>arr[i]) {
      min = arr[i]
      minI = i
    }
  }
  return minI
}
// 取最小
export const maxed = function(arr) {
  let max = arr[0]
  let maxI = 0
  for(let i=0;i< arr.length;i++) {
    if(max<arr[i]) {
      max = arr[i]
      maxI = i
    }
  }
  return maxI
}
