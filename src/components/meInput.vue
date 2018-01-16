<template lang="pug">
  .me-input
    input( v-model='currValue', @input='change($event)')
</template>
<script>
  export default {
    name: 'meInput',
    props: {
      value: [String, Number]
    },
    data() {
      return {
        currValue: this.value
      }
    },
    methods: {
      change(e) {
        let target = e.target
        this.$emit('input', target.value)
      }
    },
    watch: {
      value: {
        immediate: true,
        handler: function (n, o) {
          console.log(n, o, 'n ---------o')
          this.currValue = n
        }
      }

    }
  }
</script>
