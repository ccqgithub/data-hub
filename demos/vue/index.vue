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
import Rx from 'rxjs';
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

    this.addUser$ = new Rx.Subject();
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
      .switchMap(hub.pipe('action.user.addUser'))
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
      state: hub.pipe('store.state')(),
    }
  },

  methods: {
    // 不用vue-rx的情况
    del(user) {
      if (this.subscriptionDeleteUser) {
        this.subscriptionDeleteUser.unsubscribe();
      }

      this.subscriptionDeleteUser = Rx.Observable.of(user.id)
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

<style lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

// NProgress
// #nprogress {
//   position: fixed;
//   left: 0;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   z-index: 9999;
//   pointer-events: auto;
//   background: rgba(0,0,0,.05);
//
//   .spinner {
//     left: 50%;
//   }
//
//   .spinner-icon {
//     border-left-color: #fff;
//     border-right-color: #fff;
//   }
//
//   .bar {
//     background: #fff;
//   }
// }

.app {
  padding-top: 50px;
}

.topBar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 50px;
  background: #00d1b2;
  color: #fff;
  line-height: 30px;
  padding: 10px;
}

.filter {
  padding: 10px;
  width: 600px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 4px;

  input {
    padding: 5px;
    line-height: 20px;
  }

  button {
    float: right;
  }
}

button {
  padding: 5px;
  line-height: 20px;
  cursor: pointer;
}

table {
  width: 600px;
  margin: 20px auto;
  border: 1px solid #ddd;
  table-layout: fixed;
  border-collapse: collapse;

  td, th {
    padding: 5px;
    border: 1px solid #ddd;
  }

  th {
    background: #ccc;
  }
}
</style>
