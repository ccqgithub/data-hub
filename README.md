# rx-hub

> 使用`数据板`， 将数据当作 `水流`一样，集中管理和监视 `数据流`。

> 数据从`数据源`流出（比如一个点击事件流），在不同的`水管`中流动变换，最终流向`目的地`(比如界面UI)。

> 依赖[RxJS 5](https://github.com/ReactiveX/RxJS)。

## Issues

- 目前暂未稳定中，还在完善，最好不要用于生产环境。
- 依赖[RxJS 5](https://github.com/ReactiveX/RxJS), `rx-hub`安装包不包含`rxjs`, 需要单独安装`npm install rxjs@5.x -S`。
- 兼容性：和`RxJs`一样，支持`ie9+`和当前的主流浏览器，具体请查看RxJS的兼容性。

## Features

- 使用`RxJS`数据流，具有RxJS的特性。
- 数据集中通过`数据板`处理，数据流清晰，配合中间件`middleware`, 监控每一次数据流动变换。
- 提供内置数据仓库`Store`。
- 单向数据流。
- 适用于绝大多数框架，同一份数据可以同时用于原生js、vue、react等页面……

## Overview

![rx-hub data flow](https://ccqgithub.github.io/res/imgs/rx-hub.jpg).

概念

- `Hub`: **数据板**，用来安装各种管道`Pipe`，需要使用数据、或者改变数据的时候，直接和数据板打交道就行。
- `Converter`: **换流器**，数据变换，接受一个数据，然后根据一定规则变换成另一个数据流。
- `Pipe`: **管道**，数据管道，一个入口，一个出口，流入旧数据，经过`Converter`变换，流出新数据。
- `Store`: **水池**，存储数据。
- `Middleware`: **中间件**，特殊的`Converter`, 挂载在管道的入口和出口，用来调试、打印日志，或者统一变换数据。

- `Observable`: **可观察的数据流**，RxJS中的主要概念，也是`rx-hub`中的数据流，可以订阅。

## Reference directory structure 

```
|
|---- `style`
|---- `entry`
|---- `lib`
|---- `data`: 数据管理
| |---- `converters`
  | |---- `server`
  | | |---- `user.js`
  | |
  | |---- `store.js`
  |
  |---- `hubs`
  | |---- `main.js`
  |
  |---- `stores`
  | |---- `main.js`
    |---- `modules`
      |- `user.js`
```

## Getting started

> install 

```sh
# install rx-hub
npm install rx-hub -S

# install rxjs, rx-hub have a peerDependencies of rxjs@5.x
npm install rxjs@5.x -S

# import
import {Hub, Store, logMiddleware} from 'data-hub';
```

> 定义`Converter`。 

每个`Converter`是一个函数，接受一个数据`payload`, 返回一个新的`Observable`对象。

```js
// converters/server/user.js
import axios from 'axios';
import Rx from 'rxjs';

export let userDel = (userId) => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(userId), 1000);
  });
  return Rx.Observable.from(promise);
};

export let userAdd = (user) => {
  // let  promsie = axios({
  //   url: 'http://www.baidu.com',
  //   method: 'post',
  //   data: data
  // }).then(response => {
  //   return response.data
  // });

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(user), 1000);
  });
  return Rx.Observable.from(promise);
};
```

```js
// converters/store.js
import {BehaviorSubject, Observable} from 'rxjs';
import mainStore from '../stores/main';

// 获取最新state
export let getState = () => {
  let state = mainStore.getState();
  let subject = new BehaviorSubject(state);
  mainStore.subscribe(subject);
  return subject;
};

// 提交更改
export let commit = ({mutation, payload}) => {
  mainStore.commit(mutation, payload);
  return Observable.of(payload);
};
```

> 定义一个`Store`. 

`Store`用来长时间存储数据，类似现实生活中的`水池`。 `Store`可以包含子模块`modules`, 每个子模块都是一个`Store`实例。

```js
// sotres/main.js
import {Store} from 'data-hub';
import user from './modules/user';

export default new Store({
  initialState: {
    user: {
      username: 'season.chen'
    }
  },
  modules: {
    user, // 用户子模块
  }
});
```

```js
// stores/modules/user.js
import {Store} from 'data-hub';

export default new Store({
  initialState: {
    list: []
  },

  mutations: {
    add(user, state) {
      state.list.push(user);
    }
  }
});
```

> 初始一个`Hub`实例。

`hub`是一个数据板，sotre, ui, server 等等数据交换都流经hub。在数据板上添加各种管道`Pipe`, 可以单个添加和批量添加。

```js
// hubs/main.js

import {Hub, logMiddleware} from 'data-hub';
import Rx from 'rxjs';
import mainStore from '../stores/main';
import * as userServerConverters from '../converters/server/user';
import * as storeConverters from '../converters/store';

const hub = new Hub({
  beforeMiddlewares: [logMiddleware],
  afterMiddlewares: [logMiddleware],
});

// actions
hub.addPipes('server.user', userServerConverters);

// server
hub.addPipes('store', storeConverters);

export default hub;
```

> 连接管道，拼接成数据的流动路线。

管道只提供数据转换的通道，最终我们要做的，就是讲这些管道组织起来，使数据从源头经过设定好的路线，流向目的地。

index.html:

```html
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
```

index.js: 

```js
import hub from '../data/hubs/main';
import {Observable} from 'rxjs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "../style/style.less";

let $app = document.getElementById('app');
let $filter = document.getElementById('filter');
let $btn = document.getElementById('search');
let $table = document.getElementById('table');

let userList = [];
let userListAfterFilter = userList;

function filter(list) {
  let filter = $filter.value.trim();
  return userList.filter(user => {
    return user.name.indexOf(filter) != -1;
  });
}

// rerender table
function updateTable() {
  let $rows = userListAfterFilter
    .map((user, i) => {
      return `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>
            <button type="button" name="button" data-index="${i}">删除</button>
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
        let i = target.getAttribute('data-index');
        let u = userListAfterFilter[i];

        NProgress.start();

        return u.id;
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
    userListAfterFilter = filter(userList);
    updateTable();
  });

// filter input
Observable.fromEvent($filter, 'input')
  .debounceTime(500)
  .subscribe(() => {
    userListAfterFilter = filter(userList);
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

## API

待补充

## run demo 

> 已经为您提供了`原生js`、`vue`、`react`三个版本的demo，三个demo共用一份数据，你可以查看`demos`目录中的源码以了解更多细节。

```
git clone https://github.com/ccqgithub/rx-hub.git
cd rx-hub/demos
npm install
num run dev
```

- 原生js： http://localhost:8181/index.html
- vue: http://localhost:8181/vue.html
- react: http://localhost:8181/index.html