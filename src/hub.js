export default class DataHub {
  constructor(options={}) {
    this._actions = {}
  }

  action(actionName, payload) {
    return this._actions[actionName](payload)
  }

  addAction(actionName, fn) {
    if (this._actions[actionName]) {
      throw new Error(`Action can not duplicate: <${actionName}> !`)
    }

    this._actions[actionName] = (...args) => fn(...args)
  }

  addActions(actions, context='') {
    Object.keys(actions).forEach(key => {
      let actionName = context ? context + '.' + key : key
      this.addAction(actionName, actions[key])
    })
  }
}
