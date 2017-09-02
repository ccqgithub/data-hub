import {Store} from 'rx-hub';
import user from './modules/user';

export default new Store({
  initialState: {
    user: {
      username: 'season.chen'
    }
  },
  modules: {
    user,
  }
})
