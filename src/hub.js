import Rx from 'rxjs'
import invariant from './util/invariant'

export default class DataHub {
  constructor(options={}) {
    this._ins = {}
    this._outs = {}
  }

  push(pipeName, payload) {
    return this._ins[pipeName]
  }

  addDest(pipeName, observer) {
    let subject = new Rx.Subject()
    subject.subscribe(observer)
    this._ins[pipeName] = subject
  }

  addDests(context, observers) {
    Object.keys(observers).forEach(key => {
      this.registerIn(context + '.' + key, observers[key])
    })
  }

  pull(pipeName, payload) {
    let observable = this._outs[pipeName](payload)
    return Rx.Observable.from(observable)
  }

  addSource(pipeName, fn) {
    this._outs[pipeName] = (payload) => {
      return fn(payload)
    }
  }

  addSources(context, fns) {
    Object.keys(observables).forEach(key => {
      this.registerOut(context + '.' + key, observables[key])
    })
  }
}
