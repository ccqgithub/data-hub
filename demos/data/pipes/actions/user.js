import Rx from 'rxjs';
import {userInfo, userUpdate, userAdd} from '../server/user';

export let addUser = (user) => {
  return Rx.Observable.of(user)
    .concatMap(userAdd)
    .concatMap(userInfo);
};
