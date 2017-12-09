const renderSlot = (_self, slot_name, data) => {
  return _self.$scopedSlots[slot_name]
    ? _self.$scopedSlots[slot_name](data)
    : _self.$slots[slot_name];
}

const isClass = (o) => {
  if(o===null) return "Null";
  if(o===undefined) return "Undefined";
  return Object.prototype.toString.call(o).slice(8,-1);
}

const deepClone = (obj) => {
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


export { renderSlot, deepClone, isClass }
