import Vue from 'vue';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import Index from '../vue/index';
import "../style/style.less";

import { setupRxDevtools } from 'rx-devtools/rx-devtools';
import 'rx-devtools/add/operator/debug';
setupRxDevtools();

Vue.use(VueRx, Rx);

const Com = Vue.extend(Index);

new Com({
  //
}).$mount('#app');
