import {Hub} from 'data-hub';
import Rx from 'rxjs';
import mainStore from '../stores/main';
import * as userServers from '../pipes/server/user';
import * as userActions from '../pipes/actions/user';

const hub = new Hub();

// store
hub.addPipe('store.state', () => {
  let subject = new Rx.Subject();
  mainStore.subscribe(subject);
  return subject;
});

// actions
hub.addPipes('server.user', userServers);

// server
hub.addPipes('action.user', userActions);

export default hub;
