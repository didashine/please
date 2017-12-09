const loadMore = {
  directives: {
    'load-more': {
      bind(el, binding) {
        let loadEnd = true;
        let next = function (pending) {
          loadEnd = true;
        }
        let loadMores = (el) => {
          if(!loadEnd) {
            return;
          }
          let scrollTop = el.scrollTop || el.pageYOffset;
          let clinetHeight = el.clientHeight;
          let allHeight = el.scrollHeight;
          if(allHeight - 2 < scrollTop + clinetHeight) {
            loadEnd = false;
            binding.value(next);
          }
          if(scrollTop === undefined) {
            loadEnd = false;
            binding.value(next, true);
          }
          // console.log(scrollTop)
        }
        el.addEventListener('scroll' ,function(){loadMores(el)}, false)
      }
    }
  }
}
export default loadMore;

/**
 * Created by SMac on 17/7/12.
 */
