export default function createRxHubComponent({
  store,
  hub,
  storeKey = '$store',
  hubKey = '$hub',
  subscriptionsKey = '$subs',
  unsubscribeKey = '$unsubscribe'
}, React) {

  class RxHubComponent extends React.Component {
    constructor(props) {
      super(props);

      this[storeKey] = store;
      this[hubKey] = hub;
      this[subscriptionsKey] = {};

      // unsubscribe
      this[unsubscribeKey] = (key) => {
        let subscriptions = this[subscriptionsKey];

        try {
          // remove one
          if (key) {
            if (
              subscriptions[key]
              && typeof subscriptions[key].unsubscribe === 'function'
            ) {
              subscriptions[key].unsubscribe();
            }
            return;
          }

          // remove all
          Object.keys(subscriptions).forEach(key => {
            let subscription = subscriptions[key];
            if (typeof subscription.unsubscribe === 'function') {
              subscription.unsubscribe();
            }
          });

        } catch(e) {
          console.error(e);
        }
      }
    }

    componentWillUnMount() {
      this[unsubscribeKey]();
    }
  };

  return RxHubComponent;
}
