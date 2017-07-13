import RxSubject from 'rxjs/Subject'

export class Store {

  // constructor
  constructor(initialState={}) {
    this._state = initialState
    this._subject = new RxSubject()
  }

  // subscribe
  subscribe(observer) {
    return this._subject.subscribe(observer)
  }

  // get store's state
  get state() {
    let state = this._state

    Object.keys(this.modules).forEach(moduleName => {
      state[moduleName] = this.modules[moduleName].state
    })
  }

  mutations: {
    // test(mutatinName, mutationData) {
    //   this.state.testName = mutationData.testName
    // }
  }

  modules: {
    // test: new TestStore()
  }

  /**
   * [commit description]
   * store.commit('main.user.add', {username: ''})
   */
  commit(mutationName, mutationData, prefix='') {
    let arr = mutationName.split('.', 2);
    let location = prefix ? prefix + '.' + arr[0] : arr[0];

    // module
    if (arr.length > 1) {
      let moduleName = arr[0];
      let module = this.modules[moduleName];

      if (!module) {
        throw new Error(`module <${location}> is not defined!`);
      }

      module.commit(arr[1], mutationData, location);
    }

    // mutation
    if (!this.mutations[mutationName]) {
      throw new Error(`mutation <${location}> is not defined!`);
    }

    this.mutations[mutationName](mutationData);
    this._subject.next(this.state);
  }
}
