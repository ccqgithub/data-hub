import Rx from 'rxjs';
import invariant from './util/invariant';
import logMiddleware from './middleware/log';

export default class Hub {
  // constructor
  constructor(options={}) {
    this._pipes = {};
    this._middlewares = {
      before: [],
      after: [],
    };

    // combinedMiddleware
    this.combinedMiddleware = this.combinedMiddleware.bind(this);

    this.addMiddleware('before', logMiddleware);
    this.addMiddleware('after', logMiddleware);
  }

  // get pipe
  pipe(name) {
    return this._pipes[name];
  }

  // add pipe
  addPipe(name, sourceFn) {
    this._pipes[name] = (payload) => {
      return Rx.Observable.of(payload)
        .concatMap(this.combinedMiddleware('before', name))
        .concatMap(sourceFn)
        .concatMap(this.combinedMiddleware('after', name));
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
  combinedMiddleware(type, pipeName) {
    return (payload) => {
      let observable = Rx.Observable.of({
        payload,
        pipeName,
        type,
      });
      this._middlewares[type].forEach(fn => {
        observable = observable.concatMap(fn);
      });
      return observable;
    }
  }

  // add middleware
  addMiddleware(type, fn) {
    this._middlewares[type].push(fn);
  }
}
