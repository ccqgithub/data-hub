import {Hub} from 'data-hub';
import Rx from 'rxjs';
import mainStore from '../stores/main';

const hub = new Hub();

// store
hub.addPipe('store.state', () => {
  let subject = new Rx.Subject();
  mainStore.subscribe(subject);
  return subject;
});

export default hub;
