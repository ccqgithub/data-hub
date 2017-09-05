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
    invariant(
      typeof this._pipes[name] === 'function',
      `rx-hub hub ~ pipe <${name}> is undefined or not function!`
    );
    return this._pipes[name];
  }

  // add pipe
  addPipe(name, converter) {
    this._pipes[name] = (payload) => {
      return Observable.of(payload)
        .concatMap(this.combinedMiddleware('before', name))
        .concatMap(converter)
        .concatMap(this.combinedMiddleware('after', name));
    }
  }

  // add pipes
  addPipes(context, converters) {
    Object.keys(converters).forEach(key => {
      let converter = converters[key];
      let pipeName = context + '.' + key;
      this.addPipe(pipeName, converter);
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
  addMiddleware(type, middleware) {
    this._middlewares[type].push(middleware);
  }
}
