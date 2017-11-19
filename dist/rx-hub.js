(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/Rx')) :
	typeof define === 'function' && define.amd ? define(['exports', 'rxjs/Rx'], factory) :
	(factory((global['rx-hub'] = {}),global.Rx));
}(this, (function (exports,rxjs_Rx) { 'use strict';

var NODE_ENV = "development";

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





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Store = function () {

  // constructor
  function Store() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Store);

    this._check(options);

    this.name = options.name || 'rx-hub store';
    this._isRxHubStore = true;
    this._subject = new rxjs_Rx.Subject();
    this._state = options.initialState || {};
    this._mutations = options.mutations || {};
    this._modules = options.modules || {};
  }

  createClass(Store, [{
    key: '_check',
    value: function _check(options) {
      invariant((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object', 'rx-hub sotre ~ options is not an object!');

      var initialState = options.initialState || {};
      invariant(initialState && (typeof initialState === 'undefined' ? 'undefined' : _typeof(initialState)) === 'object', 'rx-hub store ~ options.initialState is not an object!');

      var mutations = options.mutations || {};
      invariant(mutations && (typeof mutations === 'undefined' ? 'undefined' : _typeof(mutations)) === 'object', 'rx-hub store ~ options.mutations is not an object!');

      var modules = options.modules || {};
      invariant(modules && (typeof modules === 'undefined' ? 'undefined' : _typeof(modules)) === 'object', 'rx-hub store ~ options.modules is not an object!');

      Object.keys(modules).forEach(function (key) {
        var module = modules[key];
        invariant((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module._isRxHubStore, 'rx-hub store ~ module must be a store instance!');
      });
    }

    // subscribe

  }, {
    key: 'subscribe',
    value: function subscribe() {
      var _subject;

      return (_subject = this._subject).subscribe.apply(_subject, arguments);
    }

    // state

  }, {
    key: 'getState',


    // get store's state
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

        invariant(module, 'rx-hub store ~ module <' + location + '> is not defined!');

        module.commit(arr[1], payload, location);

        // let observer know
        this._subject.next(this.getState());

        return;
      }

      // mutation
      invariant(this._mutations[mutation], 'rx-hub store ~ mutation <' + location + '> is not defined!');

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
  }, {
    key: 'state',
    get: function get$$1() {
      return this.getState();
    }
  }]);
  return Store;
}();

var Hub = function () {
  // constructor
  function Hub() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Hub);

    var beforeMiddlewares = options.beforeMiddlewares || [];
    var afterMiddlewares = options.afterMiddlewares || [];

    this._pipes = {};
    this._middlewares = {
      before: beforeMiddlewares,
      after: afterMiddlewares
    };

    // combinedMiddleware
    this.combinedMiddleware = this.combinedMiddleware.bind(this);
  }

  // get pipe


  createClass(Hub, [{
    key: 'pipe',
    value: function pipe(name) {
      invariant(typeof this._pipes[name] === 'function', 'rx-hub hub ~ pipe <' + name + '> is undefined or not function!');
      return this._pipes[name];
    }

    // add pipe

  }, {
    key: 'addPipe',
    value: function addPipe(name, converter) {
      var _this = this;

      this._pipes[name] = function (payload) {
        return rxjs_Rx.Observable.of(payload).concatMap(_this.combinedMiddleware('before', name)).concatMap(converter).concatMap(_this.combinedMiddleware('after', name));
      };
    }

    // add pipes

  }, {
    key: 'addPipes',
    value: function addPipes(context, converters) {
      var _this2 = this;

      Object.keys(converters).forEach(function (key) {
        var converter = converters[key];
        var pipeName = context + '.' + key;
        _this2.addPipe(pipeName, converter);
      });
    }

    // commine middlewares

  }, {
    key: 'combinedMiddleware',
    value: function combinedMiddleware(type, pipeName) {
      var _this3 = this;

      return function (payload) {
        var observable = rxjs_Rx.Observable.of(payload);
        _this3._middlewares[type].forEach(function (fn) {
          observable = observable.map(function (payload) {
            return {
              payload: payload,
              pipeName: pipeName,
              type: type
            };
          }).concatMap(fn);
        });
        return observable;
      };
    }

    // add middleware

  }, {
    key: 'addMiddleware',
    value: function addMiddleware(type, middleware) {
      this._middlewares[type].push(middleware);
    }
  }]);
  return Hub;
}();

var VuePlugin = {};

VuePlugin.install = function (Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  var storeOptionKey = options.storeOptionKey || 'store';
  var storeKey = options.storeKey || '$store';
  var hubOptionKey = options.hubOptionKey || 'hub';
  var hubKey = options.hubKey || '$hub';
  var stateKey = options.stateKey || 'state';
  var subscriptionsKey = options.subscriptionsKey || '$subs';

  // mixin
  Vue.mixin({
    data: function data() {
      var vm = this;

      // injection data with state
      return defineProperty({}, stateKey, vm[storeKey] ? vm[storeKey].state : null);
    },
    beforeCreate: function beforeCreate() {
      var vm = this;
      var options = vm.$options;
      var store = options[storeOptionKey];
      var hub = options[hubOptionKey];

      // store injection
      if (store) {
        vm[storeKey] = typeof store === 'function' ? store() : store;
      } else if (options.parent && options.parent[storeKey]) {
        vm[storeKey] = options.parent[storeKey];
      }

      // hub injection
      if (hub) {
        vm[hubKey] = typeof hub === 'function' ? hub() : hub;
      } else if (options.parent && options.parent[hubKey]) {
        vm[hubKey] = options.parent[hubKey];
      }

      // subscriptions
      vm[subscriptionsKey] = {};
    },


    methods: {
      $unsubscribe: function $unsubscribe(key) {
        var vm = this;
        var subscriptions = vm[subscriptionsKey];

        try {
          // unsubscribe one
          if (key) {
            if (subscriptions[key] && typeof subscriptions[key].unsubscribe === 'function') {
              subscriptions[key].unsubscribe();
            }
            return;
          }

          // unsubscribe all
          Object.keys(subscriptions).forEach(function (key) {
            var subscription = subscriptions[key];
            if (subscription && typeof subscription.unsubscribe === 'function') {
              subscription.unsubscribe();
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    },

    beforeDestroy: function beforeDestroy() {
      this.$unsubscribe();
    }
  });
};

function logMiddleware(_ref) {
  var payload = _ref.payload,
      pipeName = _ref.pipeName,
      type = _ref.type;

  var data = payload;
  var typeMsg = {
    before: 'in',
    after: 'out'
  }[type];

  try {
    var _data = JSON.parse(JSON.stringify(payload));
  } catch (e) {
    //
  }

  console.log('rx-hub log ~ pipe ' + typeMsg + ' <' + pipeName + '>:', data);

  return rxjs_Rx.Observable.of(payload);
}

function createRxHubComponent(_ref, React) {
  var store = _ref.store,
      hub = _ref.hub,
      _ref$storeKey = _ref.storeKey,
      storeKey = _ref$storeKey === undefined ? '$store' : _ref$storeKey,
      _ref$hubKey = _ref.hubKey,
      hubKey = _ref$hubKey === undefined ? '$hub' : _ref$hubKey,
      _ref$subscriptionsKey = _ref.subscriptionsKey,
      subscriptionsKey = _ref$subscriptionsKey === undefined ? '$subs' : _ref$subscriptionsKey,
      _ref$unsubscribeKey = _ref.unsubscribeKey,
      unsubscribeKey = _ref$unsubscribeKey === undefined ? '$unsubscribe' : _ref$unsubscribeKey;

  var RxHubComponent = function (_React$Component) {
    inherits(RxHubComponent, _React$Component);

    function RxHubComponent(props) {
      classCallCheck(this, RxHubComponent);

      var _this = possibleConstructorReturn(this, (RxHubComponent.__proto__ || Object.getPrototypeOf(RxHubComponent)).call(this, props));

      _this[storeKey] = store;
      _this[hubKey] = hub;
      _this[subscriptionsKey] = {};

      // unsubscribe
      _this[unsubscribeKey] = function (key) {
        var subscriptions = _this[subscriptionsKey];

        try {
          // remove one
          if (key) {
            if (subscriptions[key] && typeof subscriptions[key].unsubscribe === 'function') {
              subscriptions[key].unsubscribe();
            }
            return;
          }

          // remove all
          Object.keys(subscriptions).forEach(function (key) {
            var subscription = subscriptions[key];
            if (typeof subscription.unsubscribe === 'function') {
              subscription.unsubscribe();
            }
          });
        } catch (e) {
          console.error(e);
        }
      };
      return _this;
    }

    createClass(RxHubComponent, [{
      key: 'componentWillUnMount',
      value: function componentWillUnMount() {
        this[unsubscribeKey]();
      }
    }]);
    return RxHubComponent;
  }(React.Component);

  

  return RxHubComponent;
}

exports.Store = Store;
exports.Hub = Hub;
exports.VuePlugin = VuePlugin;
exports.logMiddleware = logMiddleware;
exports.createRxHubComponent = createRxHubComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=rx-hub.js.map
