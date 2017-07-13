export default class DataHub {
  constructor() {
    this._actions = {};
  }

  action(actionName, actionData) {
    return this._actions[actionName](actionData);
  }

  addAction(actionName, fn) {
    if (this._actions[actionName]) {
      throw new Error(`Action can not duplicate: <${actionName}> !`);
    }

    this._actions[actionName] = (...args) => fn(...args);
  }
}

DataHub.getUniqueInstance = () => {
  if (!DataHub._uniqueInstance) {
    DataHub._uniqueInstance = new DataHub();
  }

  return DataHub._uniqueInstance;
}
