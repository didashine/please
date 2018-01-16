
import { fontSize, headings, fontFamily, headingsConfig } from './baseConfig'

let parseBox = (type ,configId, proto) => {
  let defaultProto = {
    name: 'name',
    id: 'id'
  }
  Object.assign(defaultProto, proto||{})
  for(let i =0; i<type.length;i++) {
    if(type[i][defaultProto['id']] == configId) {
      return type[i][defaultProto['name']]
    }
  }
  return type[0][defaultProto['name']]
}
export let parse = (bpConf, txtConf, priority) => {
  // console.time('parse')
  let nativeConfig = {}
  let type = txtConf ? 'bpTxt': 'bp'
  let conf = txtConf ? txtConf: bpConf
  for(let pro in conf) {
    if(pro == 'fontSize') {
      nativeConfig[pro] = parseBox(fontSize, conf[pro])
    }
    else if(pro == 'fontFamily') {
      nativeConfig[pro] = parseBox(fontFamily, conf[pro], {name: 'css'})
    }
    else if(pro == 'space') {

    }
    else {
      nativeConfig[pro] = conf[pro]
    }
  }
  if(bpConf.heads) {
    let heading = parseBox(headingsConfig, bpConf['headings'], {id: 'name', name: type})
    Object.assign(nativeConfig, heading)
  }
  if(priority&&typeof priority === 'object') {
    Object.assign(nativeConfig, priority)
  }
  // console.timeEnd('parse')
  return nativeConfig
}

