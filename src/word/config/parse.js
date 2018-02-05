
import { fontSize, headings, fontFamily, headingsConfig } from './baseConfig'
import {deepClone} from "../until/until";

export let parseBox = (type ,configId, proto) => {
  let defaultProto = {
    name: 'name',
    id: 'id'
  }
  Object.assign(defaultProto, proto||{})
  for(let i =0; i<type.length;i++) {
    if(type[i][defaultProto['id']] == configId) {
      if(defaultProto['name'] === 'all') {
        return type[0]
      }
      return type[i][defaultProto['name']]
    }
  }
  if(defaultProto['name'] === 'all') {
    return type[0]
  }
  return type[0][defaultProto['name']]
}
export let parse = function(confType, bp, txtConf, priority) {
  let nativeConfig = {}

  let type = confType
  // 参数是否带有txtConf conf最终选最后面那个conf
  let conf = confType === "bpTxt" ? txtConf: bp['bpStyle']
  let headConf = {}
  // 如果是开启标题类的
  if(conf.heads) {
    let bpConf = bp['bpStyle'];
    headConf = parseBox(headingsConfig, bpConf['headings'], {id: 'name', name: 'all'})
    Object.assign(conf, headConf[type])
  }
  for(let pro in conf) {
    if(pro === 'fontSize') {
      nativeConfig[pro] = parseBox(fontSize, conf[pro])
    }
    else if(pro === 'fontFamily') {
      nativeConfig[pro] = parseBox(fontFamily, conf[pro], {name: 'css'})
    }
    else {
      nativeConfig[pro] = conf[pro]
    }
  }
  if(type === 'bp') {

    let bpConf = bp['bpStyle'];
    let newArr = deepClone(txtConf);
    let sort = newArr.sort((a, b) => {
      return b['s']['fontSize']- a['s']['fontSize']});
    let fontSizeId = sort[0]['s']['fontSize'];
    let fonts = parseBox(fontSize, fontSizeId)
    nativeConfig['height'] = this.autoHeight ? 'auto': bpConf['space']* parseInt(fonts)+ 'px'
  }

  if(priority&&typeof priority === 'object') {
    Object.assign(nativeConfig, priority)
  }
  return nativeConfig
}




