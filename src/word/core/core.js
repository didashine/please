import {NORMAL_CONFIG} from '../config/baseConfig'
export let normalPage = (config) => {
  let normal = {
    t: 'page',
    m: [
      normalBp(config),
      normalBp(config),
      normalBp(config)
    ],
    w: 800
  }
  return [normal]
}
// 简单元素
export let easyB = (txt, configs) => {
  configs = configs||NORMAL_CONFIG
  let noraml = {s: {
    ...configs.bpTxt
  }, t_txt: txt === undefined ? '\u00A0': txt, flag: true}

  return noraml
}

// 默认对象
export let normalBp = (configs) => {
  configs = configs||NORMAL_CONFIG

  let normal = {
    t: 'bp',
    ...configs.bp,
    m: [easyB('\u00A0', configs)]
  }
  return normal
}
export let normalTb = (row, col, config) => {
  let tbw = '800'
  let tb = () => {
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
        // 段落内容
        t_bp: [normalBp(config)]
    }
    return normal
  }

  let table = []
  for(let r=0; r<row; r++) {
    table.push({
      // 是否是单独一个tr
      has_a_r: false,
      t: [],
      col_l: col
    })
    for(let c=0;c<col;c++) {
      table[r]['t'].push(tb())
    }
  }
  table.map((tr) => {
    tr['t'].map((t, i) => {
      t.t_w = tbw/col
      t.i= i
    })
  })

  return { t: 'tb', m: table, w: tbw}
}
