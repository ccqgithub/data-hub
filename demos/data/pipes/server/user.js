import axios from 'axios';
import Rx from 'rxjs';

export let userInfo = (user) => {
  // let promsie = axios({
  //   url: 'http://www.baidu.com',
  //   method: 'get',
  //   data: params
  // });
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(user), 1000);
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
