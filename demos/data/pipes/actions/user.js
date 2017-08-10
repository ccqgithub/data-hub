import Rx from 'rxjs';
import {userInfo, userUpdate} from '../sources/server/user';

export function updateUser = ({id, info}) => {
  return Rx.Observable.of({id, info})
    .concatMap(userUpdate)
    .map(() => id)
    .concatMap(userInfo);
};
