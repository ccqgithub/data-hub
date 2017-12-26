import {Store, useRx} from 'data-hub';
import Rx from 'rxjs/Rx';
import user from './modules/user';

useRx(Rx);

export default new Store({
  debug: true,
  initialState: {
    user: {
      username: 'season.chen'
    }
  },
  modules: {
    user,
  }
})
