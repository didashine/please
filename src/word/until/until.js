export let setStore = function(key,value){
  if(typeof value === 'object'){
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(key,value)
}
export let getStore = function(key){
  var item = window.localStorage.getItem(key);

  return item ? JSON.parse(item): null;
}
export let clearStore = function(key) {
  window.localStorage.removeItem(key)
}
export function dateFormat(date, format) {
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
}

// spliceMap(sliceIntercept, (b, i) => {
//   if(isSpaceTxt(b.t_txt)) {
//     sliceIntercept.splice(i, 1)
//     return true
//   }
// })

export let spliceMap = (arr, fn) =>{
  let i = 0;
  let length = arr.length;
  let step = 0;
  for(; i< length; i++){
    let originI = i;
    let prevL = arr.length;
    if(fn.call(arr, arr[step+ i], step+ i , originI)) {
      if(prevL === arr.length) {
        throw new Error('当返回true时必须进行移除数组操作,检查是否进行了数组移除')
        return;
      }
      step --;
    }else{
      if(prevL > arr.length) {
        throw new Error('当进行移除数组操作时必须返回true,检查true是否返回')
        return;
      }
    }
  }
}
export let once = () =>{
  let exec = false
  return function (fn) {
    if(!exec&&(exec = true)) {
      fn()
    }
  }
}
export function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
export function deepClone(obj){
  let result = isClass(obj) == "Array"? []: {};
  for(let key in obj){
    let copy=obj[key];
    if(typeof copy =="object"){
      result[key]=deepClone(copy);
    }else{
      result[key]=obj[key];
    }
  }
  return result;
}
export function isClass(o){
  if(o===null) return "Null";
  if(o===undefined) return "Undefined";
  return Object.prototype.toString.call(o).slice(8,-1);
}
export let _last = (arr) => {
  return arr[arr.length- 1];
}

export function each() {

}
export function decide(condition) {

}

