<template lang="html">
  <div class="app">
    <div class="topBar">
      user: username
    </div>

    <filter-component :filter.sync="filter"></filter-component>

    <list :filter="filter"></list>
  </div>
</template>

<script>
import {Observable, Subject} from 'rxjs/Rx';
import hub from '../data/hubs/main';
import store from '../data/stores/main';
import NProgress from 'nprogress';
import Filter from './filter';
import List from './list';
import 'nprogress/nprogress.css';

export default {
  // injection store
  store,
  // injection hub
  hub,
  components: {
    FilterComponent: Filter,
    List
  },
  data() {
    return {
      filter: '',
    }
  },

  computed: {

  },

  methods: {

  },

  mounted() {
    // NProgress.start()
  }
}
</script>
