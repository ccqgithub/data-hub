# 核心概念

## 转换器：Converter

> `转换器`：每一次数据变换是一次数据流动，经过一个长长的管道，转换器是这个管道中的一个节点，这个节点流入一个旧的数据流，经过变换后流出一个新的数据流。

每一个`转换器`是一个函数，传入一个数据对象`payload`, 传出一个可观察的数据流（Observable：RxJS数据流）。

```js
import Rx from 'rxjs/Rx';

// payload: userId
export let userDel = (payload) => {
  let promise = new Promise((resolve, reject) => {
    // 处理一些删除用户的事情
    setTimeout(() => resolve(payload), 1000);
  });
  // 流出
  return Rx.Observable.from(promise);
};
```

## 数据板：Hub

> 一条数据流就是一条管道，这个管道分为很多段，每一段水管中间是一个`转换器`，数据从水管头流入，经过转换器的变换，从水管尾流出。

> 数据板就是将这些一段段的`管道`集中监控管理起来，监控其中的数据流动。

```js
import {Hub, logMiddleware} from 'rx-hub';
import Rx from 'rxjs/Rx';
import * as userConverters from '../converters/user';
import * as storeConverters from '../converters/store';

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

## 一段管道：Pipe

> rx-hub 将每一次数据变换都抽象为一个管道，数据从管道口流入，如果你订阅这个管道，数据流程的时候就会通知你这个观察者。

> Pipe 就表示这个管道中的一段，每一段管道都是又一个 `转换器` 和多个 `中间件` 构成，转载在数据板上使用。

将一段段管道装载在数据板上：

```js
// 将用户操作的一段段水管装载到数据板上
hub.addPipes('server.user', userConverters);
```

通过数据板调用管道：

```js
Observable.of({})
  // 在整个数据流中间插入一段管道
  .concatMap(hub.pipe('store.getState'))
  // 订阅管道
  .subscribe((state) => {
    userList = state.user.list;
    updateTable();
  });
```

## 数据池：Store

> `Store`：Store 类似水池，一个应用可以有很多 Store 来存储数据，但为了管理方便，一般一个应用使用同一个核心的Store。

```js
import {Store} from 'data-hub';
import user from './modules/user';

export default new Store({
  // 初始状态
  initialState: {
    loginUser: {
      username: 'season.chen'
    }
  },
  // 子模块
  modules: {
    user, // 用户子模块
  },
  // 数据变更
  mutations: {
    setLoginUser(user, state) {
      state.loginUser = user;
    }
  }
});
```

## 中间件：Middleware

> 每一个中间件其实就是一个`转换器`，主要用来监控或者统一变换数据，它统一安装在一个数据板的`每一段管道（Pipe）`的两端。

管道分为两种：

- `beforeMiddlewares`：安装在每一段管道的入口。
- `afterMiddlewares`：安装在每一段管道的出口。

## 辅助工具

rx-hub除了依赖RxJS外，直接就可以用在任何地方，但是为了在实际项目中使用方便，这里提供针对各种项目的一些辅助工具

- `VuePlugin`：针对Vue项目
- `createRxHubComponent`: 针对Reac项目。
