export class Store {
  constructor(initialState={}) {
    this._state = initialState;
    this._observerbles = [];
  }

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state = newState;
  }

  subscribe() {

  }
}
