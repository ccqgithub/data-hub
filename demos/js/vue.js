import Vue from 'vue';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import Index from '../vue/index';

Vue.use(VueRx, Rx);

const Com = Vue.extend(Index);
console.log('ooxx==')
new Com({
  //
}).$mount('#app');
