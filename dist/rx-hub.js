(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rxjs'], factory) :
	(factory((global['rx-hub'] = {}),global.Rx));
}(this, (function (exports,Rx) { 'use strict';

Rx = Rx && Rx.hasOwnProperty('default') ? Rx['default'] : Rx;

var NODE_ENV = process.env.NODE_ENV;

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error = void 0;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Store = function () {

  // constructor
  function Store() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Store);

    this._check(options);

    this.name = options.name || 'storeName';
    this._isDataHubStore = true;
    this._subject = new Rx.Subject();
    this._state = options.initialState || {};
    this._mutations = options.mutations || {};
    this._modules = options.modules || {};
  }

  createClass(Store, [{
    key: '_check',
    value: function _check(options) {
      invariant((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'Store options must be object!');

      var initialState = options.initialState || {};
      invariant(initialState && (typeof initialState === 'undefined' ? 'undefined' : _typeof(initialState)) === 'object', 'Store initialState must be object!');

      var mutations = options.mutations || {};
      invariant(mutations && (typeof mutations === 'undefined' ? 'undefined' : _typeof(mutations)) === 'object', 'Store mutations must be object!');

      var modules = options.modules || {};
      invariant(modules && (typeof modules === 'undefined' ? 'undefined' : _typeof(modules)) === 'object', 'Store modules must be object!');

      Object.keys(modules).forEach(function (key) {
        var module = modules[key];
        invariant((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module._isDataHubStore, 'Store module must be a store instance!');
      });
    }

    // subscribe

  }, {
    key: 'subscribe',
    value: function subscribe(observer) {
      return this._subject.subscribe(observer);
    }

    // get store's state

  }, {
    key: 'getState',
    value: function getState() {
      var _this = this;

      var state = this._state;

      Object.keys(this._modules).forEach(function (moduleName) {
        state[moduleName] = _this._modules[moduleName].getState();
      });

      return state;
    }

    /**
     * [commit description]
     * store.commit('main.user.add', {username: ''})
     */

  }, {
    key: 'commit',
    value: function commit(mutation, payload) {
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      var arr = mutation.split('.', 2);
      var location = parent ? parent + '.' + arr[0] : arr[0];

      // module
      if (arr.length > 1) {
        var moduleName = arr[0];
        var module = this._modules[moduleName];

        invariant(module, 'module <' + location + '> is not defined!');

        module.commit(arr[1], payload, location);

        return;
      }

      // mutation
      invariant(this._mutations[mutation], 'mutation <' + location + '> is not defined!');

      var mutationFunc = this._mutations[mutation].bind(this);
      mutationFunc(payload, this._state, this);

      // let observer know
      this._subject.next(this.getState());
    }

    // store is also a observer

  }, {
    key: 'next',
    value: function next(_ref) {
      var mutation = _ref.mutation,
          payload = _ref.payload;

      this.commit(mutation, payload);
    }
  }, {
    key: 'error',
    value: function error() {
      //
    }
  }, {
    key: 'complete',
    value: function complete() {
      //
    }
  }]);
  return Store;
}();

function logMiddleware(payload, pipeName) {
  console.log("pipe: " + pipeName);
  console.log(payload);
  return payload;
}

var Hub = function () {
  // constructor
  function Hub() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Hub);

    this._pipes = {};
    this._middlewares = {
      beforeSource: [],
      afterSource: []
    };

    // combinedMiddleware
    this.combinedMiddleware = this.combinedMiddleware.bind(this);

    this.addMiddleware('beforeSource', logMiddleware);
    this.addMiddleware('afterSource', logMiddleware);
  }

  // get pipe


  createClass(Hub, [{
    key: 'pipe',
    value: function pipe(name) {
      return this._pipes[name];
    }

    // add pipe

  }, {
    key: 'addPipe',
    value: function addPipe(name, sourceFn) {
      var _this = this;

      this._pipes[name] = function (payload) {
        return Rx.Observable.of(payload).map(_this.combinedMiddleware('beforeSource', name, payload)).concatMap(sourceFn).map(_this.combinedMiddleware('afterSource', name, payload));
      };
    }

    // add pipes

  }, {
    key: 'addPipes',
    value: function addPipes(context, pipeFns) {
      var _this2 = this;

      Object.keys(pipeFns).forEach(function (key) {
        var pipeFn = pipeFns[key];
        var pipeName = context + '.' + key;
        _this2.addPipe(pipeName, pipeFn);
      });
    }

    // commine middlewares

  }, {
    key: 'combinedMiddleware',
    value: function combinedMiddleware(type, name, payload) {
      var _this3 = this;

      return function (payload) {
        _this3._middlewares[type].forEach(function (fn) {
          payload = fn(payload, name);
        });
        return payload;
      };
    }

    // add middleware

  }, {
    key: 'addMiddleware',
    value: function addMiddleware(fn, type) {
      this._middlewares[type] = fn;
    }
  }]);
  return Hub;
}();

exports.Store = Store;
exports.Hub = Hub;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=rx-hub.js.map
