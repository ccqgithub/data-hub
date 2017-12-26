# 开始

## 定义数据存储：`Store`。

这是一个用户增删的简单应用的Store。

```js
// data/stores/main.js
import Rx from 'rxjs';
import {Store, useRx} from 'data-hub';

useRx(Rx);

export default new Store({
  debug: process.env.NODE_ENV !== 'production',
  initialState: {
    list: []
  },

  mutations: {
    add(user, state) {
      state.list.push(user);
    },
    delete(id, state) {
      let list = state.list;
      let index = -1;

      list.forEach((item, idx) => {
        if (item.id == id) index = idx;
      });

      list.splice(index, 1);
    },
    update({id, newUser}, state) {
      let list = state.list;
      let index = -1;

      list.forEach((item, idx) => {
        if (item.id == id) index = idx;
      });

      state.list[index] = newUser;
    }
  }
});
```

## 定义`转换器`

每一个`转换器`是一个函数，传入一个数据对象`payload`, 传出一个可观察的数据流（Observable：RxJS数据流）。

```js
// data/converters/user.js
import axios from 'axios';
import Rx from 'rxjs';

// 删除用户：传入用户id，传出数据为 用户id的数据流
export let userDel = (userId) => {
  let promise = new Promise((resolve, reject) => {
    // 处理一些删除用户的事情
    setTimeout(() => resolve(userId), 1000);
  });
  return Rx.Observable.from(promise);
};

// 添加用户：传入用户信息`user`，传出服务器返回的数据对象
export let userAdd = (user) => {
  let promsie = axios({
    url: 'http://www.baidu.com',
    method: 'post',
    data: data
  }).then(response => {
    return response.data
  });

  return Rx.Observable.from(promise);
};
```

```js
// data/converters/store.js
import {BehaviorSubject, Observable} from 'rxjs';
import mainStore from '../stores/main';

// store的状态，流入空数据，流出store的状态
export let getState = () => {
  let state = mainStore.state;
  let subject = new BehaviorSubject(state);
  mainStore.subscribe(subject);
  return subject;
};

// 提交更改store,流入store变换信息，流出变换数据
export let commit = ({mutation, payload}) => {
  mainStore.commit(mutation, payload);
  return Observable.of(payload);
};
```

## 定义一个`数据板`（Hub）

```js
import {Hub, logMiddleware, useRx} from 'data-hub';
import Rx from 'rxjs/Rx';
import mainStore from '../stores/main';
import * as userConverters from '../converters/user';
import * as storeConverters from '../converters/store';

useRx(Rx);

// 初始化一个数据板实例
const hub = new Hub({
  beforeMiddlewares: [logMiddleware],
  afterMiddlewares: [logMiddleware],
});

// 将用户操作的一段段水管装载到数据板上
hub.addPipes('server.user', userConverters);

// 将Store操作的一段段水管装载到数据板上
hub.addPipes('store', storeConverters);

export default hub;
```

## 使用数据板和store

模板文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>data-hub with simple javascript</title>
  <!-- html-webpack-plugin-css -->
</head>
<body>
  <div class="app" id="app">
    <div class="topBar">
      user: username
    </div>

    <div class="filter">
      <input type="text" placeholder="关键字" name="filter" id="filter">
      <button type="button" name="button" id="search">
        添加
      </button>
    </div>

    <table id="table">
      <thead>
        <tr>
          <th>id</th>
          <th>用户名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>

      </tbody>
    </table>
  </div>
  <!-- html-webpack-plugin-script -->
</body>
</html>
```

js 文件：

```js
import hub from '../data/hubs/main';
import {Observable} from 'rxjs/Rx';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "../style/style.less";

let $app = document.getElementById('app');
let $filter = document.getElementById('filter');
let $btn = document.getElementById('search');
let $table = document.getElementById('table');

let userList = [];

// rerender table
function updateTable() {
  let filter = $filter.value.trim();
    let $rows = userList.filter(user => {
      return user.name.indexOf(filter) != -1;
    })
    .map((user, i) => {
      return `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>
            <button type="button" name="button" data-id="${user.id}">删除</button>
          </td>
        </tr>
      `;
    });

  // bind delete user
  $table.querySelector('tbody').innerHTML = $rows.join('');
  $table.querySelectorAll('tr > td > button').forEach(($btn, index) => {
    // delete
    Observable.fromEvent($btn, 'click')
      .pluck('target')
      .map(target => {
        let id = target.getAttribute('data-id');

        NProgress.start();

        return id;
      })
      .switchMap(hub.pipe('server.user.userDel'))
      .map(id => {
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
  });
}

// watch state change
Observable.of({})
  .concatMap(hub.pipe('store.getState'))
  .subscribe((state) => {
    userList = state.user.list;
    updateTable();
  });

// filter input
Observable.fromEvent($filter, 'input')
  .debounceTime(500)
  .subscribe(() => {
    updateTable();
  });

// add new user
let addUserSubscription;
$btn.addEventListener('click', () => {
  // unsubscibe
  if (addUserSubscription) addUserSubscription.unsubscribe();

  let user = {
    id: Date.now(),
    name: 'user-' + Math.round(Math.random() * 1000000),
  }

  NProgress.start();

  addUserSubscription = Observable.of(user)
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
});
```
