const {fromJS, List, getIn, Map,setIn,splice, removeIn, isKeyed, toJs} = require('immutable')
// let arr = []
// let fos = Map({a: 1, b: 3333, c: [{a: 1, b: 2}, {c: 1, d: 2}]})
// arr.push[fos]
// fos.getIn(['c']).slice(0, 1)
// let h = fos.getIn(['c'])
// h.splice(0, 1)
// fos = fos.setIn(['c'], h)
// arr.push=[fos]
// arr.map((r) => {
//   console.log(r.getIn(['c']))
// })
// let ax = fromJS({ a: {b: [10, 20, 30]}, c: 40}, function (key, value, path) {
//   console.log(key, value, path)
//   return isKeyed(value) ? value.toOrderedMap() : value.toList()
// })
// console.log(ax, 'ax')

/*
*
*
*
*
*
*
*
*
* */


// import SImmutable from 'seamless-immutable';
// const Imm = require('seamless-immutable').static
// let s = []
// let foo = SImmutable({h: {a: 1, b: 2, c: [1,2,3]}})
// s.push(foo)
// foo = Imm.setIn(foo,['h', 'c', '1'], 'hhhhh' )
// s.push(foo)
// console.log(foo, 'n')
// foo = Imm.setIn(foo,['h', 'c', '1'], 'bbbb')
// s.push(foo)
// console.log(s, foo)
// foo = Imm.without(foo, ['h', 'c', '1'])
//
// console.log(foo, 'without')
// const fruits = SImmutable(['apple', 'banana', 'cherry']);
// let f = Imm.without(fruits, 'banana', { byValue: true });
// console.log(f,fruits, 'f', f[1])
export default () => {
  const Immutable = require('seamless-immutable').static
  let arr = []
  let fos = Map({a: 1, b: 3333, c: [{a: 1, b: 2}, {c: 1, d: 2}]})
  arr.push(fos)
  fos.getIn(['c']).slice(0, 1)
  let h = fos.getIn(['c'])
  h.splice(0, 1)
  fos = fos.setIn(['c'], h)
  arr.push(fos)
  arr.map((r) => {
    // console.log(r.getIn(['c']))
  })
  var stateV1 = Map({
    users: [
      { name: 'Foo' },
      { name: 'Bar' },
      { name: 'XJOO'}
    ]
  });
  let stateV2 = stateV1.updateIn(['users'],(x, i) => {
    // console.log(x, 'x', i)
    let n = List(x).toJS()
    n.push({name: 'xxxx'})
    return n
    // x.push({name: 'xxx'})
    // return x.splice(0, 1)
  })
  // let hs = stateV1.getIn(['users'])
  // let users = List(hs).push({name: 1111})
  // let stateV2 = stateV1.setIn(['users'], users.toJS())
  // let sv2 = stateV2.getIn(['users'])
  // let sv2m = sv2.slice(0,1)
  // sv2.splice(0, 1)
//
  // console.log(stateV2.getIn(['users']), stateV1.getIn(['users']))
}
