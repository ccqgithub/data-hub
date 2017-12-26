import {Rx, checkRx} from '../rxjs';

export default function createRxHubComponent({
  store,
  hub,
  storeKey = '$store',
  hubKey = '$hub',
  subscriptionsKey = '$subs'
}, React) {

  class RxHubComponent extends React.Component {
    constructor(props) {
      super(props);

      // check rx install
      checkRx();

      this[storeKey] = store;
      this[hubKey] = hub;
      this[subscriptionsKey] = {};      
    }

    $unsubscribe(ns) {
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

    componentWillUnMount() {
      this.$unsubscribe();
    }
  };

  return RxHubComponent;
}
