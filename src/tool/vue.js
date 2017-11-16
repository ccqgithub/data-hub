const VuePlugin = {};

VuePlugin.install = function(Vue, options={}) {

  let storeOptionKey = options.storeOptionKey || 'store';
  let storeKey = options.storeKey || '$store';
  let hubOptionKey = options.hubOptionKey || 'hub';
  let hubKey = options.hubKey || '$hub';
  let stateKey = options.stateKey || 'state';
  let subscriptionsKey = options.subscriptionsKey || '$subs';

  // mixin
  Vue.mixin({
    data() {
      const vm = this;

      // injection data with state
      return {
        [stateKey]: vm[storeKey] ? vm[storeKey].state : null,
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
      $unsubscribe(key) {
        const vm = this;
        const subscriptions = vm[subscriptionsKey];

        try {
          // unsubscribe one
          if (key) {
            if (
              subscriptions[key]
              && typeof subscriptions[key].unsubscribe === 'function'
            ) {
              subscriptions[key].unsubscribe();
            }
            return;
          }

          // unsubscribe all
          Object.keys(subscriptions).forEach(key => {
            let subscription = subscriptions[key];
            if (subscription && typeof subscription.unsubscribe === 'function') {
              subscription.unsubscribe();
            }
          });
        } catch(e) {
          console.log(e);
        }
      }
    },

    beforeDestroy() {
      this.$unsubscribe();
    }
  });
}

export default VuePlugin;
