const {Map, getIn, setIn} = require('immutable')
export const setProperty = function (obj, name, value) {
  return obj.setIn(name.split('.'), value)
}
export const push = function(obj, name, value) {
  console.log(name, 'name')
  let o = getIn(obj, name.split('.'))
  console.log(0, o)
  o.push(value)
  return obj.setIn(name.split('.'), o)
}
