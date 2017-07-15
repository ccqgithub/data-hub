export function add(payload, {getStore}) {
  let store = getStore('main')
  store.commit('user.add')
}
