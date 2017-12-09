import { renderSlot } from './until/fn';
let vNode = {}
export default {
  name: 'pageX',
  created() {
    this.$options.render = (h) => h('div', this.$slots.default)
    console.log('pageX created')
    console.log('pageX render')
    //this.$slots.pageContent[0].children.pop();
    this.store.genPagesX(
      { renderPage: (data) => renderSlot(this, 'default', data),
      }
    )
    this.store.genVnode(this.$slots.default)
  },
  mounted() {
    console.log('pageX mounted')
    console.log(this.$scopedSlots, '#scopedSlots')

  },
  render() {

  },
  computed: {
    //获取store
    store() {
      return this.$parent.store
    }
  }
}
