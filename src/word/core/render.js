import {parse} from '../config/parse'
let hasFillInData = (txt) => {
  let fillReg = /@{.+}/
  return fillReg.test(txt)
}

let renderInd = function(h, bp, b, data_id, bi) {
    return (
      <span
        style={
          parse.call(this,
            'bpTxt',
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
        class={`b_txt ${data_id}.${bi} ${b.flag ? 'active': ''}`}
        data-index={bi} data-id={`${data_id}.${bi}`}>
          {b.t_txt}
        {showIcon(h, b, `${data_id}.${bi}`)}
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
  renderByType(h, t, data, data_id, index, inTable) {
    let map = {
      tb: 'renderTable',
      bp: 'renderBp'
    }
    return map[t] ? render[map[t]].call(this, h, data, data_id, index, inTable) : null
  },
  // 渲染表格
  renderTable(h, table, data_id) {
    return (
      <x-table
        class='word_bp'
        data-type='table'
        {...{
          props: {
            renderData: table,
            app: this,
            dataId: data_id
          }
        }}
        ref={data_id}
      ></x-table>
    )
  },
  renderB(h, bp, line, data_id) {
    return (
      this._l(line['m'], (b, bi) => {
        return(
          renderInd.call(this, h, bp, b, data_id, bi)
        )
      })
    )
  },
  renderBpGroup(h, bpGroup, data_id, index, inTable) {
    return (
      <div class={"bp_group "+data_id}>
        {
          this._l(bpGroup.group, (bp, index) => {
            return render.renderB.call(this, h, bp, data_id+ '.group'+ index)
          })
        }
      </div>
    )
  },
  // 渲染普通行
  renderBp(h, bp, data_id, index) {
    return (
      <div class={"kr-fv bp_format "+data_id} data-type={bp.t} data-index={index} data-id={data_id}>
        {
          this._l(bp['m'], (line, lineI) => {
            return (
              <div data-type={line.t}>
                <div class="kr-xu bp_indent" style={parse.call(this, 'bp', bp, line['m'], line)}
                >
                <span
                  class={`bp_txt ${data_id}.m.${lineI}`}
                  data-bp-id={data_id}
                  data-bp-index={index}
                  data-index={lineI}
                  data-id={data_id+'.m.'+ lineI}
                  style={ this.nowrap?
                    { 'whiteSpace':'nowrap'}: {}}
                >
                  {render.renderB.call(this, h, bp, line, data_id+'.m.'+ lineI+ '.m')}
                </span>
                </div>
              </div>

            )
          })
        }

      </div>
    )

  }
}
