import Rx from 'rxjs';
import invariant from './util/invariant';

export default class Hub {
  // constructor
  constructor(options={}) {
    this._pipes = {};
    this._middlewares = {
      beforeSource: [],
      afterSource: [],
    };

    // combinedMiddleware
    this.combinedMiddleware = this.combinedMiddleware.bind(this);
  }

  // get pipe
  pipe(name) {
    return this._pipes[name];
  }

  // add pipe
  addPipe(name, sourceFn) {
    this._pipes[name] = (payload) => {
      return Rx.Observable.of(payload)
        .map(this.combinedMiddleware())
        .concatMap(sourceFn)
        .map(this.combinedMiddleware());
    }
  }

  combinedMiddleware(type) {
    return (payload) => {
      this.middlewares[type].forEach(fn => {
        payload = fn(payload);
      });
      return payload;
    }
  }

  addMiddleware(fn, type) {
    this._middlewares[type] = fn;
  }
}
