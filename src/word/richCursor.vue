<template lang="pug">
  .richTxt
    textarea( ref='textarea')
</template>
<script>
  import { selection } from './core'
  export default {
    name: '',
    data() {
      return {
        referenceElm: ''
      }
    },
    methods: {
      focus() {
        let textarea = this.$refs.textarea

      }
    }
  }
</script>
<style lang="stylus">
  .richTxt {
    width:1px ;
    height: 16px;
    position: absolute;
    left: 0;
    top: -30px;
    background: greenyellow;
  }
  .richTxt textarea {
    outline: none;
    border: none;
    width: 1px;
    background: none;
    resize: none;
    height: 16px;
    margin-left: -1px;
    color: transparent;
  }
</style>
