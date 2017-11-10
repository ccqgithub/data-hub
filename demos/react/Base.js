import React from 'react';
import {createRxHubComponent} from 'rx-hub';
import hub from '../data/hubs/main';
import store from '../data/stores/main';

const Base = createRxHubComponent({
  hub,
  store
}, React);

export default Base;
