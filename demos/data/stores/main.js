import {Store} from 'data-hub'
import user from './user'

export default new Store({
  initialState: {
    something: 'something'
  },
  modules: {
    user,
  }
})
