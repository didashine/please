<template lang='pug'>

</template>
<script>
  const Drag = {a() {}}
  export default {
    inject: ['drag_dos_name'],
    computed: {
      dragGroup() {
        let parent;
        let name = this['drag_dos_name']
        parent = this.$parent
        while(parent&&!parent[name]) {
        }
        parent = parent.$parent
        return parent
      }
    },
    directives: {
      'easy-drag': {
        inserted:''
      }
    }
  }
</script>

