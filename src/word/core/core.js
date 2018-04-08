import {NORMAL_CONFIG, pageConfig} from '../config/baseConfig'
export let normalPage = (config, m) => {

  let normal = {
    t: 'page',
    m: config === undefined ? m: [
      normalBp(config),
      normalBp(config)
    ],
    w: pageConfig.width,
    h: pageConfig.height,
    operateH: pageConfig.operateHeight,
    padding: pageConfig.padding,
    paddingTop: pageConfig.paddingTop,
  }
  if(config === undefined&&m === undefined) {
    return normal = {
      t: 'page',
      m: [],
      w: pageConfig.width,
      h: pageConfig.height,
      padding: pageConfig.padding,
      paddingTop: pageConfig.paddingTop,
      operateH: pageConfig.operateHeight
    }
  }
  return normal
}
// 简单元素

// &#65279;
// \u00A0
export let easyB = (txt, configs, patchCode) => {
  // console.log()
  configs = configs||NORMAL_CONFIG
  let noraml = {s: {
    ...configs.bpTxt
  }, t_txt: txt === undefined ? '\u00A0': txt, flag: false, patchCode: patchCode||''}
  return noraml
}

// 默认段落对象
export let normalBp = (configs, txt, patchCode) => {
  configs = configs||NORMAL_CONFIG;


  let normal = {
    hidden: false,
    t: 'bp',
    h: 0,
    m: [
      // 内部行
      aloneBp(configs, txt, patchCode)

    ],
    bpStyle: {...configs.bp}
    // m: [easyB(txt!==undefined? txt: '\u00A0', configs)]
  }
  return normal
}
export let aloneBp = (configs, txt, patchCode) => {
  configs = configs||NORMAL_CONFIG;
  return {m:[easyB(txt!==undefined? txt: '\u00A0', configs, patchCode)], t: 'line'}
}
export let normalGroupBp = () => {
  let normal = []
}
export let normalTd = (config, existConf) => {

  let normal = {
    // 是否有选中
    t_s: false,
    // 单元格宽度
    t_w: 0,
    // 单元格高度
    t_h: 0,
    // 显而易见
    colspan: 1,
    // 显而易见
    rowspan: 1,
    show: true,
    merge: {},
    // destroy: false,
    // 段落内容
    t_bp: config ? [normalBp(config)]: []
  }
  Object.assign(normal, existConf||{})
  return normal
}
export let normalTb = (row, col, config) => {

  let tbw = '100%'
  if(typeof row === 'object') {
    let fragmentI = col
    return { t: 'tb', m: row, w: tbw, fragmentI}
  }
  let td = normalTd
  let table = []
  for(let r=0; r<row; r++) {
    table.push({
      // 是否是单独一个tr
      has_a_r: false,
      td: [],
      col_l: col,
      h: 0,
      destroy: []
    })
    for(let c=0;c<col;c++) {
      table[r]['td'].push(td(config))
    }
  }
  table.map((tr) => {
    tr['td'].map((t, i) => {
      t.t_w = tbw/col
      t.i= i
    })
  })
  return { t: 'tb', m: table, w: tbw}
}
