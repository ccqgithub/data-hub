import axios from 'axios';
import Rx from 'rxjs';

export let userInfo = (params) => {
  let promsie = axios({
    url: 'http://www.baidu.com',
    method: 'get',
    data: params
  });
  return Rx.Observable.from(promsie)
};

export let userList = (params) => {
  let  promsie = axios({
    url: 'http://www.baidu.com',
    method: 'get',
    data: params
  });
  return Rx.Observable.from(promsie);
};

export let userUpdate = (data) => {
  let  promsie = axios({
    url: 'http://www.baidu.com',
    method: 'post',
    data: data
  }).then(response => {
    return response.data
  });
  return Rx.Observable.from(promsie);
};
