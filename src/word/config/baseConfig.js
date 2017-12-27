export let NORMAL_CONFIG = {
  bp: {
    textAlign: 'left',
    marginLeft: 0,
    heads: true,
    headings: '正文'
  },
  bpTxt: {
    fontSize: 11,
    color: '#000',
    fontFamily: 0,
    textDecoration: 'none'
  }
}
export let headingsConfig = [
    {
      name: '正文',
      bp: {height: '33px'},
      bpTxt: {
        color: 'black',
        fontSize: '12px',
        lineHeight: '18px'
      }
    },
    {
      name: '标题',
      bp: {height: '84px'},
      bpTxt: {
        lineHeight: '67px',
        fontSize: '48px',
        color: '#1b2733'
      }
    },
    {
      name: '副标题',
      bp: {height: '79px'},
      bpTxt: {
        lineHeight: '36px',
        fontSize: '32px',
        color: '#666666'
      }
    },
    {
      name: '标题1',
      bp: { height: '47px'},
      bpTxt: {
        lineHeight: '33px',
        fontSize: '24px',
        color: '#1b2733'
      }
    },
    {
      name: '标题2',
      bp: { height: '36px'},
      bpTxt:  {
        lineHeight: '21px',
        fontSize: '26px',
        color: '#1b2733'
      }
    }
  ]
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
export let fontFamily = [
  {
  name: '黑体',
  id: 0
},{
  name: '楷体',
  id: 1
},{
  name: '宋体',
  id: 2
  }]
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




