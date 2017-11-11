import axios from 'axios';
import Rx from 'rxjs/Rx';

export let userDel = (userId) => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(userId), 1000);
  });
  return Rx.Observable.from(promise);
};

export let userAdd = (user) => {
  // let  promsie = axios({
  //   url: 'http://www.baidu.com',
  //   method: 'post',
  //   data: data
  // }).then(response => {
  //   return response.data
  // });

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(user), 1000);
  });
  return Rx.Observable.from(promise);
};
