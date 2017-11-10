const VuePlugin = {};

VuePlugin.install = function(Vue, options) {
  let storeOptionKey = options.storeOptionKey || 'store';
  let storeKey = options.storeKey || '$store';
  let hubOptionKey = options.hubOptionKey || 'hub';
  let hubKey = options.hubKey || '$hub';
  let stateKey = options.stateKey || 'state';
  let subscriptionsKey = options.subscriptionsKey || '$subs';

  // mixin
  Vue.mixin({
    data() {
      return {
        [stateKey]: null
      }
    },

    beforeCreate() {
      const vm = this;
      const options = vm.$options;
      const store = options[storeOptionKey];
      const hub = options[hubOptionKey];

      // store injection
      if (store) {
        vm[storeKey] = typeof store === 'function' ? store() : store;
        // state injection
        vm[stateKey] = vm[storeKey].state;
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

    beforeDestroy() {
      const vm = this;

      try {
        for (let subscription of vm[subscriptionsKey]) {
          subscription.unsubscribe();
        }
      } catch(e) {
        console.error(e);
      }
    }
  });
}

export default VuePlugin;
