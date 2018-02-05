import {setStore, dateFormat, getStore} from "./until";
console._log = (txt) => {
  let time = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
  let log = {
    time,
    txt
  }
  console.time('time')
  let log_mix = getStore('log_mix');
  console.timeEnd('time')
  if(log_mix) {
    log_mix.push(log);
  }else {
    log_mix = [log];
  }
  console.time('stortime')
  setStore('log_mix', log_mix);
  console.timeEnd('stortime')
}

