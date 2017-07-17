import hub from '../hubs/main'

export function updateUser(id, info) {
  return hub.push('server.user.userInfo', {id, info})
    .map(payload => {
      // save to store
      hub.dest('store.main').next({
        mutation: 'user.saveInfo',
        payload: payload
      })
      return payload
    })
}
