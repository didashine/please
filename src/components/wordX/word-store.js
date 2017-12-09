import { deepClone } from './until/fn'
export default class wordStore {
  constructor(vm, options) {
    this._vm = vm;
    this.state = {
      vNode: [],
      pages: [],
      data: {},
      render: []}

    let data = options.data || {};
    let dataClone = {};
    for(let key in data) {
      dataClone[key] = deepClone(data[key])
    }
    this.state.data = dataClone;
  }
  data() {
    return this.state.data;
  }
  pages() {
    return this.state.pages;
  }
  vNode() {
    return this.state.vNode;
  }
  genVnode(vNode) {
    //console.log(this.state, vNode)
    this.state.vNode.push(vNode);
  }
  genPagesX(pages) {
    console.log(this.pages, 'this.pages')
    this.pages().push(pages);
  }
}
