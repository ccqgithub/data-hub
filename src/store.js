export class Store {

  // constructor
  constructor(options={}) {
    this.check(options)

    this.name = options.name || 'storeName'
    this._isDataHubStore = true
    this._observers = []
    this._state = options.initialState || {}
    this._mutations = options.mutations || {}
    this._modules = options.modules || {}
  }

  _check(options) {
    if (typeof options !== 'object') {
      throw new Error(`store options must be object!`)
    }

    if (options.initialState && typeof options.initialState !== 'object') {
      throw new Error(`initialState must be object!`)
    }

    if (options.mutations && typeof options.mutations !== 'object') {
      throw new Error(`mutations must be object!`)
    }

    if (options.modules && typeof options.modules !== 'object') {
      throw new Error(`modules must be object!`)
    }

    Object.keys(options.modules).forEach(key => {
      let module = options.modules[key]
      if (typeof module !== 'object' || !module._isDataHubStore) {
        throw new Error(`module must be a store instance!`)
      }
    })
  }

  // subscribe
  subscribe(observer) {
    this._observers.push(observer)
    return {
      unsubscripbe() {
        let index = this._observers.indexOf(observer)
        this._observers.splice(index, 1)
      }
    }
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

      if (!module) {
        throw new Error(`module <${location}> is not defined!`)
      }

      module.commit(arr[1], payload, location)
    }

    // mutation
    if (!this.mutations[mutation]) {
      throw new Error(`mutation <${location}> is not defined!`)
    }

    this.mutations[mutation](payload)

    this._observers.forEach(observer => {
      observer.next(this)
    })
  }
}
