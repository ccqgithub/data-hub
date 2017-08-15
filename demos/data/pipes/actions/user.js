import Rx from 'rxjs';
import {userInfo, userUpdate, userAdd} from '../server/user';

export let addUser = ({id, info}) => {
  return Rx.Observable.of({id, info})
    .concatMap(userAdd)
    .map(() => {
      console.log('addUser')
      return {};
    })
    .concatMap(userInfo);
};
