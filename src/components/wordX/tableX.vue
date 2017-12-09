<template lang="pug">
  table.table_x
    slot
</template>
<script>
  let genVnode = (slots) => {

  }
  export default {
    name: 'table_x',
    data() {
      return {

      }
    },
    created() {
      let table = this.$slots.default;

    }
  }
</script>
<style lang="stylus">

</style>
