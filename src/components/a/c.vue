<template lang="pug">
  div
    span
    span foo: {{foo}}
    span vma: {{vma[0]}}
</template>
<script>
  export default {
    name: 'c',
    inject: ['vma', 'foo'],
    created() {
     // console.log('vma', this.vma)
    }
  }
</script>
