

<script type="text/jsx">
  const {List, fromJS, getIn} = require('immutable')
  import STable from './table/table'
  import xTable from './word/table.js'
  // import selection from './word/directive'
  import bp from './word/bp'
  import {normalBp} from './word/core'
  import {normalTb} from './word/core'
  import {selection} from './word/core'
  function getProperty (obj, name) {
    name = (name + '').split(".");
    for(var i = 0; i < name.length - 1; i++) {
      obj = obj[name[i]];
      if(typeof obj != "object" || !obj) return;
    }
    return obj[name.pop()];
  };
  function setProperty (obj, name, value) {
    name = (name + '').split(".");
    for(var i = 0; i < name.length - 1; i++) {
      if(typeof (obj[name[i]]) !== "object" || !obj[name[i]]) obj[name[i]] = {};
      obj = obj[name[i]];
    }
    obj[name.pop()] = value;
  };

  export default {
    name: 'app',
    data() {

      return {
        tableRenderData: ''
      }
    },
    created() {
      this.tableRenderData = normalTb(9, 6)
    },
    mounted() {
      console.log(this.$richCursor, '....d')
      document.addEventListener('mouseup', (e) => {
        console.log(/\:\$bp$/.test(e.target.dataset.id), e.target.dataset.id)
        if(/\$bp$/.test(e.target.dataset.id)) {
          this.hs(e.target, new selection(e.target).packTxt(e))
          // input
          /*
          *
          *
          *
          * */
        }
      })
    },
    components: {
      xTable
    },
    methods: {
      hs(el, h) {
        line.style.left = h.cursorX+ 'px'
        line.style.top = h.cursorY+ document.documentElement.scrollTop + 'px'
        // line.style.height = '22px'
        //tx.focus()
        let code = document.getElementsByClassName('code-cursor')[0]
        code.style.left = h.cursorX+ 'px'
        code.style.top = h.cursorY+ document.documentElement.scrollTop + 'px'
        let textarea = code.getElementsByTagName('textarea')[0]
        textarea.focus()
        // console.log([...*] message)
      }
    },
    render(h) {

      return (
        <div id="app">
          <canvas id='word-selection' width='0' height='0'></canvas>
          {
            bp(h, {bp: normalBp()}, this.hs)
          }
          <div class="bot" id='line'></div>
          <div class="code-cursor">
            <textarea name="" id="" cols="30" rows="10"></textarea>
          </div>
          <x-table {...{props: { tableRenderData: this.tableRenderData}}}></x-table>
        </div>
      )
    }

  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
  #app .wd-h-t{
    margin-top: 150px;
  }
  .bot {
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
    position: absolute;
  }
  .code-cursor {
    width: 3px;
    height: 0;
    overflow: hidden;
    position: absolute;
  }
  .code-cursor textarea {
    overflow: auto;
    resize: vertical;
    background: red;
    width: 1000px;
    height: 1em;
    border: none;

  }

</style>
