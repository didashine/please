const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
}

const trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
// // getStyle
// export function getStyle (element, styleName) {
//   if (!element || !styleName) return null;
//   styleName = camelCase(styleName);
//   if (styleName === 'float') {
//     styleName = 'cssFloat';
//   }
//   try {
//     const computed = document.defaultView.getComputedStyle(element, '');
//     return element.style[styleName] || computed ? computed[styleName] : null;
//   } catch(e) {
//     return element.style[styleName];
//   }
// }

/* 是否存在class */
export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

/* 添加class */
export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

export function siblingIncludeOwnerAndIndex(node) {
  let parent = node.parentNode
  let sibling = [...parent.childNodes]
  let i;
  for(i =0; i<sibling.length; i++) {
    if(sibling[i] == node) {
      break;
    }
  }
  i = i==sibling.length ? i-1: i
  return {
    index: i,
    sibling
  }

}
export function siblingIncludeOwner(node) {
  let parent = node.parentNode
  return parent.childNodes
}
export function prevNodes(node) {
  let sio = siblingIncludeOwnerAndIndex(node)
  return sio.sibling.filter((sibli, i) => {
    // console.log(i, sio.index, 'i')
    return sio.index>i
  })
}
export function nextNodes(node) {
  let sio = siblingIncludeOwnerAndIndex(node)
  return sio.sibling.filter((sibli, i) => {
    // console.log(i, sio.index, 'i')
    return sio.index<i
  })
}
export function prevNodeTxtLength(node) {
  // console.log(prevNode(node), 'prevNode(node)')
  let l = 0
  prevNodes(node).map((n) => {
    // console.log(n, n.innerText.length)
    l+=n.innerText.length
  })
  return l
}
export function prevNode(node) {
  return [...prevNodes(node)].slice(-1)[0]
}
export function toggleClass(el, cls) {
  hasClass(el, cls) ?
    removeClass(el, cls) :
    addClass(el, cls)
}
/* 移除class */
export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};
export let byClass = (name) => {
  return document.getElementsByClassName(name)
}
export let getTextNode = (node) => {
  if(node === undefined) {return undefined}
  if(node.nodeType == 3) {
    return node
  }
  let child = [...node.childNodes]
  return child.filter((node) => {
    if(node.nodeType == 3) return true
  })[0]
}

export function getStyle (obj, css) {
  return obj.currentStyle ? obj.currentStyle[css] :
    getComputedStyle(obj, false)[css]
};
export let getOffset = (obj,type) => {
  type = (type === 'left') ? 'offsetLeft' : 'offsetTop'
  let l = obj[type]; // 对应父容器的上边距
  while (obj = obj.offsetParent) {
    l += obj[type];
  }
  return parseInt(l)
};
export let range
if (document.createRange) range = function(node, start, end, endNode) {
  node = getTextNode(node)
  endNode = getTextNode(endNode)
  let r = document.createRange()
  // r.selectNode(node)
  r.setStart(node, start)
  r.setEnd(endNode || node, end)
  // r.collapse(true)
  return r
}
else range = function(node, start, end) {
  node = getTextNode(node)
  let r = document.body.createTextRange()
  try { r.moveToElementText(node.parentNode) }
  catch(e) { return r }
  r.collapse(true)
  r.moveEnd("character", end)
  r.moveStart("character", start)
  r.select()
  return r
};

export let isHTMLElement = (e) => {
  return (e instanceof HTMLElement)
}


