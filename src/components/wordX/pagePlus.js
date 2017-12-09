import { renderSlot } from './until/fn';
export default {
  name: 'pagePlus',
  created() {
    console.log('pagePlus created')
    //this.store.state.render = render

  },
  mounted() {
    console.log('pagePlus mounted')
  },
  render() {
    //this.store
    //console.log(render, 'render')
    　//console.log('实力更新一波页面', this.store.pages())
    console.log('update page', ',', this.store.vNode())
    return (
      <div class="pagePlus">
        {
          this.store.state.vNode.map((page, index) => {
            console.log(page, 'map')
            return (
             <div key={index}>
               {page}
             </div>
            )
          })

        }
      </div>
    )

  },
  watch: {

  },
  computed: {
    store() {
      return this.$parent.store;
    },
    data() {
      return this.store.data();
    }
  }
}
