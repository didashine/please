const {Map, getIn} = require('immutable')
import {normalBp} from './core'
import {setProperty, push} from "../data/immutable";

let code = (vm) => {

  let api = {
    updateData(data) {
      this.tableRenderData = data
    },
    newLine (e, el, proto) {
      // console.log(e, 'eee', proto)
      if(el.scrollWidth>el.clientWidth) {
         api.updateData(push(this.tableRenderData, proto, normalBp()))
      }
    }
  }
  return api

}
export default code
