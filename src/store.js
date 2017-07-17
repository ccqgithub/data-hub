import Rx from 'rxjs'
import invariant from './util/invariant'

export class Store {

  // constructor
  constructor(options={}) {
    this.check(options)

    this.name = options.name || 'storeName'
    this._isDataHubStore = true
    this._subject = new Rx.Subject()
    this._state = options.initialState || {}
    this._mutations = options.mutations || {}
    this._modules = options.modules || {}
  }

  _check(options) {
    invariant(
      typeof options === 'object',
      `Store options must be object!`
    )

    invariant(
      options.initialState
        && typeof options.initialState === 'object',
      `Store initialState must be object!`
    )

    invariant(
      options.mutations
        && typeof options.mutations === 'object',
      `Store mutations must be object!`
    )

    invariant(
      options.modules
        && typeof options.modules === 'object',
      `Store modules must be object!`
    )

    Object.keys(options.modules).forEach(key => {
      let module = options.modules[key]
      invariant(
        typeof module === 'object' && module._isDataHubStore,
        `Store module must be a store instance!`
      )
    })
  }

  // subscribe
  subscribe(observer) {
    return this._subject.subscribe(observer)
  }

  // get store's state
  getState() {
    let state = this._state

    Object.keys(this.modules).forEach(moduleName => {
      state[moduleName] = this.modules[moduleName].getState()
    })

    return state
  }

  /**
   * [commit description]
   * store.commit('main.user.add', {username: ''})
   */
  commit(mutation, payload, parent='') {
    let arr = mutation.split('.', 2)
    let location = parent ? parent + '.' + arr[0] : arr[0]

    // module
    if (arr.length > 1) {
      let moduleName = arr[0]
      let module = this.modules[moduleName]

      invariant(
        module,
        `module <${location}> is not defined!`
      )

      module.commit(arr[1], payload, location)
    }

    // mutation
    invariant(
      this.mutations[mutation],
      `mutation <${location}> is not defined!`
    )

    this.mutations[mutation](payload)

    // let observer know
    this._subject.next(this.getState())
  }
}
