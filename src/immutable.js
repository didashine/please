const {fromJS, List, getIn, Map,setIn,  isKeyed, toJs} = require('immutable')
let fos = Map({a: 1, b: 3333, c: [1,2,3]})
fos.slice(['a', 'c'], 0, 1)
console.log(List([1,2,3]), 'llll', List([1,2,3]).toJS())
console.log(fos, 'y')

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


}
