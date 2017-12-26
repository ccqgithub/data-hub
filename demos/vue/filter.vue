<template lang="html">
  <div class="filter">
    <input type="text" placeholder="关键字" v-model="filterVal" @change="changeFilter">
    <button type="button" name="button" @click="addItem">
      添加
    </button>
  </div>
</template>

<script>
import Rx from 'rxjs/Rx';
import NProgress from 'nprogress';

export default {
  props: ['filter'],
  data() {
    return {
      filterVal: this.filter
    }
  },
  mounted() {

  },
  methods: {
    changeFilter(event) {
      this.$emit('update:filter', event.target.value);
    },
    addItem() {
      this.$unsubscribe('addItem');
      NProgress.start();
      this.$subs.addItem = Rx.Observable
        .of({
          id: Date.now(),
          name: 'user-' + Math.round(Math.random() * 1000000),
        })
        .concatMap(this.$hub.pipe('server.user.userAdd'))
        .map((user) => {
          return {
            mutation: 'user.add',
            payload: user
          }
        })
        .concatMap(this.$hub.pipe('store.commit'))
        .subscribe(() => {
          console.log('success')
          NProgress.done();
        }, (err) => {
          console.log(err);
          NProgress.done();
        });
    }
  }
}
</script>
