import Rx from 'rxjs';
import invariant from './util/invariant';
import logMiddleware from './middleware/log';

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

    this.addMiddleware('beforeSource', logMiddleware);
    this.addMiddleware('afterSource', logMiddleware);
  }

  // get pipe
  pipe(name) {
    return this._pipes[name];
  }

  // add pipe
  addPipe(name, sourceFn) {
    this._pipes[name] = (payload) => {
      return Rx.Observable.of(payload)
        .map(this.combinedMiddleware('beforeSource', name, payload))
        .concatMap(sourceFn)
        .map(this.combinedMiddleware('afterSource', name, payload));
    }
  }

  // add pipes
  addPipes(context, pipeFns) {
    Object.keys(pipeFns).forEach(key => {
      let pipeFn = pipeFns[key];
      let pipeName = context + '.' + key;
      this.addPipe(pipeName, pipeFn);
    });
  }

  // commine middlewares
  combinedMiddleware(type, name, payload) {
    return (payload) => {
      this._middlewares[type].forEach(fn => {
        payload = fn(payload, name);
      });
      return payload;
    }
  }

  // add middleware
  addMiddleware(fn, type) {
    this._middlewares[type] = fn;
  }
}
