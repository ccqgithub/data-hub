import {Store} from 'data-hub'

export default new Store({
  initialState: {
    list: []
  },

  mutations: {
    add(user, {state}) {
      state.list.push(user)  
    }
  }
})
