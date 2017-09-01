<template lang="html">
  <div class="app">
    <div class="topBar">
      user: username
    </div>

    <div class="filter">
      <input type="text" placeholder="关键字" v-model="filter">
      <button type="button" name="button" v-stream:click="addUser$">
        添加
      </button>
    </div>

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
  </div>
</template>

<script>
import {Observable, Subject} from 'rxjs';
import hub from '../data/hubs/main';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default {
  data() {
    return {
      filter: '',
    }
  },

  computed: {
    filterUsers() {
      let users = this.state.user.list;
      return users.filter(user => {
        return user.name.indexOf(this.filter.trim()) != -1;
      });
    }
  },

  subscriptions() {
    let self = this;

    this.addUser$ = new Subject();
    this.addUser$
      .map(() => {
        NProgress.start();

        let user = {
          id: Date.now(),
          name: 'user-' + Math.round(Math.random() * 1000000),
        }

        console.log('click', user);

        return user;
      })
      .switchMap(hub.pipe('server.user.userAdd'))
      .map((user) => {
        return {
          mutation: 'user.add',
          payload: user
        }
      })
      .concatMap(hub.pipe('store.commit'))
      .subscribe(() => {
        console.log('success')
        NProgress.done();
      }, (err) => {
        console.log(err);
        NProgress.done();
      });

    return {
      state: Observable.of({}).concatMap(hub.pipe('store.getState')),
    }
  },

  methods: {
    // 不用vue-rx的情况
    del(user) {
      if (this.subscriptionDeleteUser) {
        this.subscriptionDeleteUser.unsubscribe();
      }

      this.subscriptionDeleteUser = Observable.of(user.id)
        .concatMap(hub.pipe('server.user.userDel'))
        .map((id) => {
          NProgress.start();
          return {
            mutation: 'user.delete',
            payload: id
          }
        })
        .concatMap(hub.pipe('store.commit'))
        .subscribe(() => {
          console.log('success')
          NProgress.done();
        }, (err) => {
          console.log(err);
          NProgress.done();
        });
    }
  },

  mounted() {
    //
  }
}
</script>
