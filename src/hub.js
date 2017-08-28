import {Observable} from 'rxjs';
import invariant from './util/invariant';

export default class Hub {
  // constructor
  constructor(options={}) {
    let beforeMiddlewares = options.beforeMiddlewares || [];
    let afterMiddlewares = options.afterMiddlewares || [];

    this._pipes = {};
    this._middlewares = {
      before: beforeMiddlewares,
      after: afterMiddlewares,
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
      return Observable.of(payload)
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
      let observable = Observable.of(payload);
      this._middlewares[type].forEach(fn => {
        observable = observable.map(payload => {
          return {
            payload,
            pipeName,
            type,
          };
        }).concatMap(fn);
      });
      return observable;
    }
  }

  // add middleware
  addMiddleware(type, fn) {
    this._middlewares[type].push(fn);
  }
}
