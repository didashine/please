<template lang="pug">
  div( id='app')
    me-input( v-model.lazy='value', @input='nInput')
    input( v-model='value', @input='nInput')
    span {{hb.m.c}}
</template>
<script>
  import meInput from './components/meInput.vue'
  export default {
    name: 'App',
    data() {
      return {
        value: '1111',
        hb: ''
      }
    },
    mounted() {
    },
    methods: {
      nInput(e) {
        e = typeof e === 'string' ? e: e.target.value
        console.log(e, 'value')
        if(e.length>5) {
          // new 字符串对象
          this['value'] = e.substr(0, 5)
          // this.$forceUpdate()
          console.log('当满足条件时被我修改的value(绑定的vModel)的值',this['value'])
        }
      },
      input(e) {
//        console.log(e.target.value, 'e....')
//        e = e.target.value
//        this.value = e
//        if(e.length>5) {
//          this['value'] = e.substr(0, 5)
//        }
        // if(e === '1')
//        console.log(this['value'], 'old value')
//        if(e.length>5) {
//          // new 字符串对象
//          this['value'] = new String(e.substr(0, 5))
//          // this.$forceUpdate()
//          console.log('当满足条件时被我修改的value(绑定的vModel)的值',this['value'])
//        }
//        // 把字符串对象转化成字符串，应对数据显示
//        this.$nextTick(() => {
//          this['value'] = this['value'].toString()
//        })
      }
    },
    computed: {
      hValue: {
        get() {
          return this.value
        },
        set(v) {
          console.log('set', v, 'hh')
          this.value = v
        }

      }
    },
    watch: {
      value: {
        immediate: true,
        handler: function (n, o) {
          console.log(n, o, 'jianting1')

        }
      }
    },
    components: {
      meInput
    }
  }
</script>
