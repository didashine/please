import {parse} from '../config/parse'
let hasFillInData = (txt) => {
  let fillReg = /@{.+}/
  return fillReg.test(txt)
}
let renderInd = (h, bp, b, data_id, bi) => {
    return (
      <span
        style={
          parse(
            bp,
            b.s,
            hasFillInData(
              b.t_txt) ?
              {
                color: 'rgba(35,132,209, 0.85)',
                textAlign: 'center',
                borderBottom: '1px solid rgba(35, 132, 209, 0.25)',
                paddingLeft: '4px',
                paddingRight: '4px'
              }:
              {}
            )
        }
        class={`b_txt ${data_id}.:${bi} ${b.flag ? 'active': ''}`}
        data-index={bi} data-id={`${data_id}.:${bi}`}>
        {b.t_txt}
        {showIcon(h, b, `${data_id}.:${bi}`)}
      </span>
    )
}
let showIcon = (h, b, data_id) => {
  // let
  if(hasFillInData(b.t_txt)) {
    return (
      <span class="icon" data-id={data_id} data-type='fillIcon'>
        <img src="/static/icon.png" alt=""/>
      </span>
    )
  }else {
    return null
  }
}
export let render = {
  renderByType(h, t, data, data_id, index) {
    let map = {
      tb: 'renderTable',
      bp: 'renderBp'
    }
    return map[t] ? render[map[t]].call(this, h, data, data_id, index) : null
  },
  // 渲染表格
  renderTable(h, table, data_id) {
    return (
      <x-table {...{props: { renderData: table, app: this, dataId: data_id}}}></x-table>
    )
  },
  renderB(h, bp, data_id) {
    return (
      this._l(bp.m, (b, bi) => {
        return(
          renderInd(h, bp, b, data_id, bi)
        )
      })
    )

  },
  // 渲染普通行
  renderBp(h, bp, data_id, index) {
    return (
      <div class="bp_format" data-type={bp.t}
      >
        <div class="bp_indent" style={parse(bp)} >
            <div
              class={`bp_txt ${data_id}`}
              data-index={index}
              data-id={data_id }
              ref={data_id}
            >
              {render.renderB.call(this, h, bp, data_id+ '.:m')}
            </div>
        </div>
      </div>
    )

  }
}
