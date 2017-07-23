import Rx from 'rxjs';
import hub from '../hubs/main';
import {userInfo, userUpdate} from '../sources/server/user';

hub.addPipe('action.updateUser', ({id, info}) => {
  Rx.Observable.of({id, info})
    .concatMap(userUpdate)
    .map(() => id)
    .concatMap(userInfo);
});
