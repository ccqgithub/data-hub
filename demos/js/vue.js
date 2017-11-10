import Vue from 'vue';
import Rx from 'rxjs/Rx';
import {VuePlugin} from 'rx-hub';
import Index from '../vue/index';
import "../style/style.less";

Vue.use(VuePlugin, {});

const Com = Vue.extend(Index);

new Com().$mount('#app');
