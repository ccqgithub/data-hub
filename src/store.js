import {Subject} from './rxjs';
import invariant from './util/invariant';

export default class Store {

  // constructor
  constructor(options={}) {
    this._check(options);

    this.debug = !!options.debug;
    this.name = options.name || 'rx-hub store';
    this._isRxHubStore = true;
    this._subject = new Subject();
    this._state = options.initialState || {};
    this._mutations = options.mutations || {};
    this._modules = options.modules || {};
  }

  _check(options) {
    invariant(
      typeof options === 'object',
      `rx-hub error ~ store: options is not an object!`
    );

    let initialState = options.initialState || {};
    invariant(
      initialState && typeof initialState === 'object',
      `rx-hub error ~ store: options.initialState is not an object!`
    );

    let mutations = options.mutations || {};
    invariant(
      mutations && typeof mutations === 'object',
      `rx-hub error ~ store: options.mutations is not an object!`
    )

    let modules = options.modules || {};
    invariant(
      modules && typeof modules === 'object',
      `rx-hub error ~ store: options.modules is not an object!`
    );

    Object.keys(modules).forEach(key => {
      let module = modules[key];
      invariant(
        typeof module === 'object' && module._isRxHubStore,
        `rx-hub error ~ store: module must be a store instance!`
      );
    });
  }

  // subscribe
  subscribe(...args) {
    return this._subject.subscribe(...args);
  }

  // state
  get state() {
    return this.getState();
  }

  // get store's state
  getState() {
    let state = this._state;

    Object.keys(this._modules).forEach(moduleName => {
      state[moduleName] = this._modules[moduleName].getState();
    });

    return state;
  }

  /**
   * clone a node in state, internal use: JSON.parse(JSON.stringify(node))
   * let userList = store.copy('user.list');
   */
  copy(path) {
    let arr = path.split('.');
    let find = this.state;

    while (typeof find === 'object' && arr.length) {
      find = find[arr.shift()];
    }

    return JSON.parse(JSON.stringify(find));
  }

  /**
   * [commit description]
   * store.commit('main.user.add', {username: ''})
   */
  commit(mutation, payload, parent='') {
    let arr = mutation.split('.', 2);
    let location = parent ? parent + '.' + arr[0] : arr[0];

    // log
    if (this.debug && !parent) {
      console.log(`rx-hub log ~ store commit <${mutation}>`, payload);
    }

    // module
    if (arr.length > 1) {
      let moduleName = arr[0];
      let module = this._modules[moduleName];

      invariant(
        module,
        `rx-hub error ~ store: module <${location}> is not defined!`
      );

      module.commit(arr[1], payload, location);

      // let observer know
      this._subject.next(this.getState());

      return;
    }

    // mutation
    invariant(
      this._mutations[mutation],
      `rx-hub error ~ store: mutation <${location}> is not defined!`
    )

    let mutationFunc = this._mutations[mutation].bind(this);
    mutationFunc(payload, this._state, this);

    // let observer know
    this._subject.next(this.getState());
  }

  // store is also a observer
  next({mutation, payload}) {
    this.commit(mutation, payload);
  }

  error() {
    //
  }

  complete() {
    //
  }
}
