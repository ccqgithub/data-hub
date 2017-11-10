const VuePlugin = {};

VuePlugin.install = function(Vue, options) {
  let stateKey = options.stateKey || 'state';

  // mixin
  Vue.mixin({
    data() {
      return {
        state: null
      }
    },

    beforeCreate() {
      const options = this.$options;

      // store injection
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }

      if (this.$store) {
        this.state = this.$store.state;
      }
    }
  });


}

export default VuePlugin;
