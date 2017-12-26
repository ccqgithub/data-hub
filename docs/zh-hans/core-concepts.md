# 核心概念

## 数据池：Store

> `Store`：每一个Store实例是一个独立的数据仓库，它内部的数据变换和获取都只能通过它暴露的接口进行。

> `单向数据流`：store中的数据是变换是单向的，通过`commit`流入，通过`get state`流出。

> 并不是所有的数据都必须存进公共store，比如一些`一次性数据`，或者`组件私有`的数据就没必要存到公共store。

- `mutation`: 数据变换，store 中的每一次`数据变换`都应该事先通过一个个`mutation`定义好，改动store的数据只能通过`mutation`操作。
- `commit`: 提交一个`mutation`动作。
- `state`: 获取store的即时数据。

定义一个 store

```js
import {Store, useRx} from 'data-hub';
import Rx, {Observable, Subject} from 'rxjs/Rx';
import user from './modules/user';

useRx(Rx);
// or: useRx({Observable, Subject});

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

## 数据流

一个操作引起数据变换，这中间的一系列过程可以看着一个数据流动。 比如：

- 添加用户操作：点击按钮产生一个数据流，这个流的初始内容是一个`点击事件`，经过变换转化为`请求参数`， 经过服务器之后，数据流的数据变化成`新的用户`, 再流入`store`存储起来。
- 获取sotre数据操作：产生一个数据流，流经Store，经过`store.getState()`变换后，流的数据变成了store的数据，再流入UI界面。

## Observable：可观察的数据流

一个Observable流，可以理解为一个定义好的数据的流动通道，数据可能随时会在这个通道流动，你可以订阅它，这样数据到来时就会流到你那里。

分为两种，具体信息需要详细理解RxJS：

- 第一种：有观察者订阅，流才启动，并且只服务于一个观察者
- 第二种：流一直启动，可以服务于多个观察者。

## Converter：数据流转换器

> 定义数据流的变换，接收一个`数据`，产生一个新的`数据流`。

每一个`转换器`是一个函数，传入一个数据对象`payload`, 传出一个可观察的数据流（Observable：RxJS数据流）或者可以通过`Rx.Observable.from`转换为数据流的对象。

- 详情参见：[Rx.Observable.from](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-from).

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

// payload: userId
export let userDel = (payload) => {
  let promise = new Promise((resolve, reject) => {
    // 处理一些删除用户的事情
    setTimeout(() => resolve(payload), 1000);
  });
  // 流出
  return promise;
};
```

## Pipe： 数据管道

data-hub 将应用的每一次操作都新建一个`临时数据流`来管理，数据的流动过程中可能会产生很多数据变换。

一个流中的`各个数据变换`是通过一段段`管道`来定义的，`数据流` 经过这个管道就得到了转变, 产生新的`数据流`(注意：是变换数据流，不是简单的改变数据)。

管道可以插入在数据流的任何地方，它定义了：

- 流入格式
- 数据流如何变换（安装各种转换器）
- 流出格式

将 Converter 注册为 Pipe

```js
// 将用户操作的一段段水管装载到数据板上
hub.addPipes('server.user', userConverters);
```

通过`数据板`调用`管道`：

```js
// 这是一段管道
let getUserListPipe = hub.pipe('server.user.getList');

Observable.of({})
  // 在整个数据流中间插入一段管道
  .concatMap(getUserListPipe)
  // 订阅管道
  .subscribe((users) => {
    console.log(users)
  });
```

## Hub：数据板

一个管道`Pipe`是可以复用的，一个操作可能要用到很多管道，但是每个用的地方都需要引入的话，很麻烦。

数据板的功能，就是事先将这些管道安装在一个`板`上，引用的时候只有通过这个板就能很方便地调用管道。

它的功能有两个：

- 事先安装管道，便于随时取出管道
- 在管道上绑定前置和后置中间件

数据板定义了：

- 管道集合和调用名称
- 每一个管道流入前的变换（中间件）
- 每一个管道流出前的变换（中间件）

```js
import {Hub, logMiddleware, useRx} from 'data-hub';
import Rx from 'rxjs/Rx';
import * as userConverters from '../converters/user';
import * as storeConverters from '../converters/store';

useRx(Rx);

// 初始化一个数据板实例，并给所有管道绑定中间件
const hub = new Hub({
  beforeMiddlewares: [logMiddleware],
  afterMiddlewares: [logMiddleware],
});

// 将用户相关的 Converter 集合快捷地添加为 数据板 的管道。
hub.addPipes('server.user', userConverters);

// 将Store相关的 Converter 集合快捷地添加为 数据板 的管道。
hub.addPipes('store', storeConverters);

export default hub;
```

## 中间件：Middleware

> 每一个中间件其实就是一个`数据流转换器:Converter`，主要用来监控或者统一变换数据，它统一安装在一个数据板的`每一段管道（Pipe）`的两端。

管道分为两种：

- `beforeMiddlewares`：安装在每一段管道的入口。
- `afterMiddlewares`：安装在每一段管道的出口。

## 辅助工具

data-hub除了依赖RxJS外，直接就可以用在任何地方，但是为了在实际项目中使用方便，这里提供针对各种项目的一些辅助工具

- `VuePlugin`：针对Vue项目
- `createRxHubComponent`: 针对Reac项目。
