<template lang="html">
  <table>
    <thead>
      <tr>
        <th>id</th>
        <th>用户名</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in filterUsers">
        <td>{{user.id}}</td>
        <td>{{user.name}}</td>
        <td>
          <button type="button" name="button" @click="del(user)">删除</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Rx from 'rxjs/Rx';
import NProgress from 'nprogress';

export default {
  props: ['filter'],
  computed: {
    filterUsers() {
      let users = this.$store.state.user.list;
      return users.filter(user => {
        return user.name.indexOf(this.filter.trim()) != -1;
      });
    }
  },
  methods: {
    // 不用vue-rx的情况
    del(user) {
      this.$unsubscribe('del');
      NProgress.start();
      this.$subs.del = Rx.Observable
        .of(user.id)
        .concatMap(this.$hub.pipe('server.user.userDel'))
        .map((id) => {
          return {
            mutation: 'user.delete',
            payload: id
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
