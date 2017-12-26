import Vue from 'vue';
import Rx from 'rxjs/Rx';
import {VuePlugin, useRx} from 'data-hub';
import Index from '../vue/index';
import "../style/style.less";

useRx(Rx);

Vue.config.errorHandler = function (err, vm, info) {
  console.log(err);
  console.log(vm);
  console.log(info)
}
Vue.use(VuePlugin, {});

const Com = Vue.extend(Index);

new Com().$mount('#app');
