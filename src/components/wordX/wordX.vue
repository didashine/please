<template lang="pug">
  .word_x
    div( style="display:none")
      slot
    page-plus
</template>
<script>
  import pagePlus from './pagePlus'
  import wordStore from './word-store'
  export default {
    name: 'wordX',
    props: {
      data: null
    },
    data() {
      let data = this.data;
      let store = new wordStore(
        this,
        {
          data: {
            data
          }
        });
      return {
        store
      }
    },
    created() {
      console.log('wordX created')
    },
    mounted() {
      setTimeout(() => {
        //console.log(this.store)
        //this.a = 132323
        //let cells = this.store.state.vNode.cells;
//        let a = this.store.state.vNode.shift();
//        console.log(a, 'a shift')
//        setTimeout(() => {
//          //cells.shift()
//          this.store.state.vNode.unshift(a)
//        }, 3000)
        //console.log(this.store.state.vNode.cells)
        //this.store.state.vNode.cells = this.store.vNode.cells.pop()
      }, 2000);
    },
    watch: {

    },
    components: {
      pagePlus
    }
  }
</script>
<style lang="stylus">

</style>
