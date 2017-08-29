# rx-hub

> 使用`数据板`， 将数据当作 `水流`一样，集中管理和监视 `数据流`。

> 数据从`数据源`流出（比如一个点击事件流），在不同的`水管`中流动变换，最终流向`目的地`(比如界面UI)。

> 依赖[RxJS](https://github.com/ReactiveX/RxJS)。

## Features

- 使用`RxJS`数据流，具有RxJS的特性。
- 数据集中通过`数据板`处理，数据流清晰，配合中间件`middleware`, 监控每一次数据流动变换。
- 提供内置数据仓库`Store`。
- 单向数据流。
- 适用于绝大多数框架、场景，可以和vue、react等框架一起使用，或者单独使用。

## Overview

![rx-hub data flow](https://ccqgithub.github.io/res/imgs/rx-hub-flow.jpg).

概念

- `Hub`: **数据板**，用来安装各种管道`Pipe`，需要使用数据、或者改变数据的时候，直接和数据板打交道就行。
- `Converter`: **换流器**，数据变换，接受一个数据，然后根据一定规则变换成另一个数据流。
- `Pipe`: **管道**，数据管道，一个入口，一个出口，流入旧数据，经过`Converter`变换，流出新数据。
- `Store`: **水池**，存储数据。
- `Middleware`: **中间件**，特殊的`Converter`, 挂载在管道的入口和出口，用来调试、打印日志，或者统一变换数据。

- `Observable`: **可观察的数据流**，RxJS中的主要概念，也是`rx-hub`中的数据流，可以订阅。

## Get Start

1. 定义`Converter`。 

> 每个`Converter`是一个函数，接受一个数据`payload`, 返回一个新的`Observable`对象。

```js
// converters/server/user.js
import axios from 'axios';
import Rx from 'rxjs';

export let addUser = (payload) => {
  let promsie = axios({
    url: 'http://api.mysite.com/userAdd',
    method: 'post',
    data: payload
  });
 
  return Rx.Observable.from(promise);
};
```

2. 定义一个`Store`. 

> `Store`用来长时间存储数据，类似现实生活中的`水池`。 `Store`可以包含子模块`modules`, 每个子模块都是一个`Store`实例。

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

3. 初始一个`Hub`实例。

> `hub`是一个数据板，sotre, ui, server 等等数据交换都流经hub。在数据板上添加各种管道`Pipe`, 可以单个添加和批量添加。

```js
// hubs/main.js

import {Hub, logMiddleware} from 'data-hub';
import Rx from 'rxjs';
import mainStore from '../stores/main';
import * as userServers from '../converters/server/user';
import * as userActions from '../converters/actions/user';

// 初始化hub，添加 log 中间件
const hub = new Hub({
  beforeMiddlewares: [logMiddleware],
  afterMiddlewares: [logMiddleware],
});

// 添加一个管道获取 store state，监听store state变化
hub.addPipe('store.state', () => {
  let state = mainStore.getState();
  let subject = new Rx.BehaviorSubject(state);
  mainStore.subscribe(subject);
  return subject;
});

// 添加一个管道 提交 sotre mutation
hub.addPipe('store.commit', ({mutation, payload}) => {
  mainStore.commit(mutation, payload);
  return Rx.Observable.of(payload);
});

// server
// hub.pipe('server.user.userAdd')
// hub.pipe('server.user.userDelete')
// ...
hub.addPipes('server.user', userServers);

// actions
// hub.pipe('server.user.userAdd')
// hub.pipe('server.user.userDelete')
// ...
hub.addPipes('action.user', userActions);

export default hub;
```

4. 连接管道，拼接成数据的流动路线。

> 管道只提供数据转换的通道，最终我们要做的，就是讲这些管道组织起来，使数据从源头经过设定好的路线，流向目的地。

```html
<!-- index.vue -->

<template lang="html">
  <div class="app">
    <button type="button" name="button" @click="add">
      添加
    </button>

    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>用户名</th>
        </tr>  
      </thead>
      <tbody>
        <tr v-for="user in users">
          <td>{{user.id}}</td>
          <td>{{user.name}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Rx from 'rxjs';
import hub from '../data/hubs/main';

export default {
  data() {
    return {
      users: []
    }
  },

  mounted() {
    let stateObservable = hub.pipe('store.state')();
    stateObservable.subscribe(state => {
      this.users = state.user.list;
    });
  }

  methods: {
    // 不用vue-rx的情况
    add() {
      // 如果上一次点击流正在流动中，则终止它
      if (this.subscriptionAddUser) {
        this.subscriptionAddUser.unsubscribe();
      }

      let newUser = {
        id: Date.now(),
        name: 'user-' + Math.round(Math.random() * 1000000),
      };

      this.subscriptionAddUser = Rx.Observable.of(newUser)
        // 经过管道`action.user.AddUser`提交服务器添加用户
        .concatMap(hub.pipe('action.user.AddUser'))
        // 组装数据，方便流向后续的管道
        .map((addedUser) => {
          // NProgress.start();
          return {
            mutation: 'user.add',
            payload: addedUser
          }
        })
        // 提交 store，使该user数据在store中删除
        .concatMap(hub.pipe('store.commit'))
        // 定义这条数据通道，以便知道何时成功失败
        .subscribe(() => {
          console.log('success')
          // NProgress.done();
        }, (err) => {
          console.log(err);
          // NProgress.done();
        });
    }
  }
}
</script>

```

## API

待补充

## run demo

```
git clone https://github.com/ccqgithub/rx-hub.git
cd rx-hub/demos
npm install
num run dev
```