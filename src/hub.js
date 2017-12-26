import {Rx, checkRx} from './rxjs';
import invariant from './util/invariant';

export default class Hub {
  // constructor
  constructor(options={}) {
    // check rx install
    checkRx();

    let beforeMiddlewares = options.beforeMiddlewares || [];
    let afterMiddlewares = options.afterMiddlewares || [];

    // Rx Refrence
    this.Rx = Rx;

    // store pipes, middlewares
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
      `data-hub error ~ pipe <${name}> is undefined or not function!`
    );
    return this._pipes[name];
  }

  // add pipe
  addPipe(name, converter) {
    let converterFn = (payload) => {
      let ob = converter(payload);
      return Rx.Observable.from(ob);
    }
    
    this._pipes[name] = (payload) => {
      return Rx.Observable.of(payload)
        .concatMap(this.combinedMiddleware('before', name))
        .concatMap(converterFn)
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
      let observable = Rx.Observable.of(payload);
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
    let middlewareFn = (payload) => {
      let ob = middleware(payload);
      return Rx.Observable.from(ob);
    }

    this._middlewares[type].push(middlewareFn);
  }
}
