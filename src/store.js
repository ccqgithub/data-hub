import {Subject} from 'rxjs/Subject';
import invariant from './util/invariant';

export default class Store {

  // constructor
  constructor(options={}) {
    this._check(options);

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
      `rx-hub sotre ~ options is not an object!`
    );

    let initialState = options.initialState || {};
    invariant(
      initialState && typeof initialState === 'object',
      `rx-hub store ~ options.initialState is not an object!`
    );

    let mutations = options.mutations || {};
    invariant(
      mutations && typeof mutations === 'object',
      `rx-hub store ~ options.mutations is not an object!`
    )

    let modules = options.modules || {};
    invariant(
      modules && typeof modules === 'object',
      `rx-hub store ~ options.modules is not an object!`
    );

    Object.keys(modules).forEach(key => {
      let module = modules[key];
      invariant(
        typeof module === 'object' && module._isRxHubStore,
        `rx-hub store ~ module must be a store instance!`
      );
    });
  }

  // subscribe
  subscribe(observer) {
    return this._subject.subscribe(observer);
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
   * [commit description]
   * store.commit('main.user.add', {username: ''})
   */
  commit(mutation, payload, parent='') {
    let arr = mutation.split('.', 2);
    let location = parent ? parent + '.' + arr[0] : arr[0];

    // module
    if (arr.length > 1) {
      let moduleName = arr[0];
      let module = this._modules[moduleName];

      invariant(
        module,
        `rx-hub store ~ module <${location}> is not defined!`
      );

      module.commit(arr[1], payload, location);

      // let observer know
      this._subject.next(this.getState());

      return;
    }

    // mutation
    invariant(
      this._mutations[mutation],
      `rx-hub store ~ mutation <${location}> is not defined!`
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
