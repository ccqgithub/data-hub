import {Store} from 'rx-hub';
import user from './modules/user';

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
