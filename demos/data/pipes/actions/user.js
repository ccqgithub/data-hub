import Rx from 'rxjs';
import {userInfo, userUpdate} from '../server/user';

export let updateUser = ({id, info}) => {
  return Rx.Observable.of({id, info})
    .concatMap(userUpdate)
    .map(() => id)
    .concatMap(userInfo);
};
