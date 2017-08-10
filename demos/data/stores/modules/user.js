import {Store} from 'data-hub';

export default new Store({
  initialState: {
    list: []
  },

  mutations: {
    add(user, state) {
      state.list.push(user);
    },
    delete(id, state) {
      let list = state.list;
      let index = -1;

      list.forEach((item, idx) => {
        if (item.id == id) index = idx;
      });

      state.list = list.splice(index, 1);
    },
    update({id, newUser}, state) {
      let list = state.list;
      let index = -1;

      list.forEach((item, idx) => {
        if (item.id == id) index = idx;
      });

      state.list[index] = newUser;
    }
  }
})
