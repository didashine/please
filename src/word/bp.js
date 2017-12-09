let parse = {
  1: {
    label: '一级标题',
    style: {
      fontSize: '18px',
      lineHeight: '30px'
    }
  }
}
const direcctivesCompany = (fn) => {
  const directives = [
    {name: 'v-selection',
     value: fn
    }
    // { name: 'debounce',
    //   modifiers: {'keyup': true},
    //   arg: 500,
    //   value: fn
    // }
  ]
  return {
    directives
  }
}
export default function(h, {bp}, fn) {
    return (
      <div class="wd-h-t">

      </div>
    )
}
