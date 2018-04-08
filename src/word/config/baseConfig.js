export let NORMAL_CONFIG = {
  bp: {
    textAlign: 'left',
    marginLeft: 0,
    headings: '正文',
    space: 1.4,
    height: 0,
  },
  bpTxt: {
    heads: false,
    fontSize: 36,
    color: '#000',
    fontFamily: 2,
    textDecoration: 'none'
  }
}
export let globa_config = {
  isServer: true,
  // 用户使用下还是报告编制人员下
  isUser: false,
  log: true
}
// 页配置
export let pageConfig = {
  operateHeight: 300, // 923
  height: 400, // 1083
  width: 792,
  padding: '80px 80px',
  // 分页计算使用
  paddingTop: 80

}
//
export let headingsConfig = [
    {
      name: '正文',
      bp: {
        // height: '24px',
        space: 4.6
      },
      bpTxt: {
        color: 'black',
        fontSize: 11
      }
    },
    {
      name: '标题',
      bp: {
        // height: '86px',
        space: 1.8
      },
      bpTxt: {
        fontSize: 36,
        color: '#1b2733'
      }
    },
    {
      name: '副标题',
      bp: {
        // height: '79px',
        space: 2.5
      },
      bpTxt: {
        fontSize: 24,
        color: '#666666'
      }
    },
    {
      name: '标题1',
      bp: {
        // height: '47px',
        space: 2.0
      },
      bpTxt: {
        fontSize: 18,
        color: '#1b2733'
      }
    },
    {
      name: '标题2',
      bp: {
        // height: '36px',
        space: 1.9
      },
      bpTxt:  {
        fontSize: 14,
        color: '#1b2733'
      }
    }
  ]
// 字号配置
export let fontSize = [{
  name: '11px',
  id: 8
}, {
  name: '12px',
  id: 9
}, {
  name: '13px',
  id: 10
}, {
  name: '15px',
  id: 11
}, {
  name: '16px',
  id: 12
}, {
  name: '19px',
  id: 14
}, {
  name: '24px',
  id: 18
}, {
  name: '32px',
  id: 24
}, {
  name: '48px',
  id: 36
}, {
  name: '64px',
  id: 48
}];
// 字体配置
export let fontFamily = [
  {
    name: '黑体',
    css: 'Heiti SC',
    id: 0
  },{
    name: '楷体',
    css: 'Kai',
    id: 1
  },{
    name: '宋体',
    css: "Songti, SimSun, Songti SC, STsong",
    id: 2
  },
  {
    name: 'Arial',
    css: 'Arial',
    id: 3
  },
  {
    name: '华文仿宋',
    css: 'STFangsong',
    id: 4
  },
  {
    name: '隶书',
    css: 'LiSu',
    id: 5
  },
  {
   name: '鬼知道什么假宋体(金亮要求的宋体)',
   css: 'Songti SC',
   id: 6
  }
]
export let headings = [
  {
    name: '正文',
    id: 0
  },
  {
    name: '标题',
    id: 1
  },
  {
    name: '副标题',
    id: 2
  }, {
    name: '标题1',
    id: 3
  }, {
    name: '标题2',
    id: 4
  }]




