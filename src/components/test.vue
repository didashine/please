<template lang="pug">
  div 1111
    div {{a}}
      div.display_lists( @click='click') click
</template>
<script>
  export default {
    data() {
      return {
        a: 222
      }
    },
    methods: {
      click() {
        this.a = 323434
      }
    }
  }
</script>
