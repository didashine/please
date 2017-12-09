const {fromJS, List, OrderedMap} = require('immutable')
import SImmutable from 'seamless-immutable';
const Imm = require('seamless-immutable').static
let foo = SImmutable({h: {a: 1, b: 2, c: [1,2,3]}})
let bar = foo.merge({a: { b: 2}})
console.log(foo.h)
let n = Imm.set(foo.h, 'a', {new: 11})
console.log(n, foo, 'new foo')
export default () => {


}
