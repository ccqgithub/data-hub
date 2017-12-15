import {Hub, logMiddleware} from 'data-hub';
import Rx from 'rxjs/Rx';
import mainStore from '../stores/main';
import * as userServerConverters from '../converters/server/user';
import * as storeConverters from '../converters/store';

const hub = new Hub({
  beforeMiddlewares: [logMiddleware],
  afterMiddlewares: [logMiddleware],
});

// actions
hub.addPipes('server.user', userServerConverters);

// server
hub.addPipes('store', storeConverters);

export default hub;
