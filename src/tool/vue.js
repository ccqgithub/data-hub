import {Rx, checkRx} from '../rxjs';
const VuePlugin = {};

VuePlugin.install = function(Vue, options={}) {
  // check rx install
  checkRx();

  let storeOptionKey = options.storeOptionKey || 'store';
  let storeKey = options.storeKey || '$store';
  let hubOptionKey = options.hubOptionKey || 'hub';
  let hubKey = options.hubKey || '$hub';
  let stateKey = options.stateKey || '$state';
  let subscriptionsKey = options.subscriptionsKey || '$subs';

  Vue.prototype.$unsubscribe = function(ns) {
    const vm = this;
    const subs = vm[subscriptionsKey];

    try {
      // unsubscribe one
      if (ns) {
        let sub = subs[ns]; 
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
        delete subs[ns];
        return;
      }

      // unsubscribe all
      Object.keys(subs).forEach(key => {
        let sub = subs[key];
        if (sub && typeof sub.unsubscribe === 'function') {
          sub.unsubscribe();
        }
        delete subs[key];
      });
    } catch(e) {
      console.log(e);
    }
  }

  // mixin
  Vue.mixin({

    beforeCreate() {
      const vm = this;
      const options = vm.$options;
      const store = options[storeOptionKey];
      const hub = options[hubOptionKey];

      // subscriptions
      vm[subscriptionsKey] = {};

      // store injection
      if (store) {
        vm[storeKey] = typeof store === 'function' ? store() : store;
        vm[stateKey] = ( new Vue({ data: vm[storeKey].state }) ).$data;
      } else if (options.parent && options.parent[storeKey]) {
        vm[storeKey] = options.parent[storeKey];
        vm[stateKey] = options.parent[stateKey];
      }

      // hub injection
      if (hub) {
        vm[hubKey] = typeof hub === 'function' ? hub() : hub;
      } else if (options.parent && options.parent[hubKey]) {
        vm[hubKey] = options.parent[hubKey];
      }

      // subjects
      let subjects = options['subjects'] || [];
      subjects.forEach(sName => {
        vm[sName] = new Rx.Subject();
      });
    },

    beforeDestroy() {
      this.$unsubscribe();
    }
  });
}

export default VuePlugin;
