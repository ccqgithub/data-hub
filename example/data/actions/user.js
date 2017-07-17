import hub from '../hubs/main'

export function getUserinfo(id) {
  return hub.out('server.user.userInfo', {id})
    .map(payload => {
      // save to store
      hub.in('store.main').next({
        mutation: 'user.saveInfo',
        payload: payload
      })
      return payload
    })
}
