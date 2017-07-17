import Rx from 'rxjs'
import invariant from './util/invariant'

export default class DataHub {
  constructor(options={}) {
    this._ins = {}
    this._outs = {}
  }

  in(pipeName, payload) {
    return this._ins[pipeName]
  }

  registerIn(pipeName, observer) {
    let subject = new Rx.Subject()
    subject.subscribe(observer)
    this._ins[pipeName] = subject
  }

  registerIns(context, observers) {
    Object.keys(observers).forEach(key => {
      this.registerIn(context + '.' + key, observers[key])
    })
  }

  out(pipeName, payload) {
    let observable = this._outs[pipeName](payload)
    return Rx.Observable.from(observable)
  }

  registerOut(pipeName, fn) {
    this._outs[pipeName] = (payload) => {
      return fn(payload)
    }
  }

  registerOuts(context, fns) {
    Object.keys(observables).forEach(key => {
      this.registerOut(context + '.' + key, observables[key])
    })
  }
}
