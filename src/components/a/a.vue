<template lang="pug">
  div
    span a: {{a}}
    bt-s
</template>
<script>
  import btS from './b.vue'
  export default {
    name: 'atS',
    provide() {
      return {
        foo: this.foo,
        vma: this.a,
      }
    },
    data() {

      return {
        a: [1,2,3,4],
        foo: 22
      }
    },
    components: {
      btS
    },
    mounted() {
      setTimeout(() => {
       // console.log('....', this.$prompt, this.$provide, '........')

        this.foo = 123232
        //console.log(this.vma)
        //this.vma.a = 12323
        this.a = [111,2]
        //console.log(this)
      }, 2000)

    }
  }
</script>
