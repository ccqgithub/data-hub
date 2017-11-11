# API

## Converter: 流转换器

> 每个`Converter`是一个纯函数，接受一个流数据`payload`, 返回一个新的可观察流：`Rx.Observable`实例（或者`Rx.Subject`实例）。

- `payload`: 传入的数据.

```js
// create a converter
// the payload is a userId
let getUserInfo = (payload) => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let userInfo = {
        // ...
      };
      resolve(userInfo);
    }, 1000);
  });
  return Rx.Observable.from(promise);
};

// user the converter
let userId = 1;
let observable = Rx.Observable.of(userId).concatMap(userDel);
observable.subscribe((user) => {
  // user
  console.log(user);
})
```

## Hub: 数据板

- `new Hub(options)`: 创建实`Hub`例.

```js
import {Hub} from 'rx-hub';

const hub = new Hub({
  // 管道进入前的中间件
  beforeMiddlewares: [logMiddleware],
  // 管道流程后经过的中间件
  afterMiddlewares: [logMiddleware],
});
```

- `hub.addPipe(name, converter)`: 添加一个管道。

  - `name`: 管道名称
  - `converter`: Converter

  ```js
  hub.addPipe('user.addUser',  (payload) => {
    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(payload), 1000);
    });
    return Rx.Observable.from(promise);
  });

  // or
  import {addUser} from '../converters/user';
  hub.addPipe('user.addUser', addUser);
  ```

- `hub.addPipes(context, converters)`: 添加一批管道。

  - `context`: 管道集合名
  - `converters`: Conterver集合

  ```js
  // add pipes: user.addUser, user.deleteUser ...
  import userConverters from '../converters/user';
  hub.addPipe('user', userConverters);
  ```

- `hub.addMiddleware(type, middleware)`: 添加中间件。

  - `type`: 中间件位置， `before`|`after`。
  - `middleware`: 中间件，特殊的`Converter`。

  ```js
  import {logMiddleware} from 'rx-hub';

  hub.addMiddleware('before', logMiddleware);
  ```

## `Middleware`: 中间件。

> 一个中间件其实就是一个`Converter`, 只是放置的位置不一样而已。中间件分为两种类型，`beforeMiddleware`和`afterMiddleware`。

> 中间件每个位置可以安装多个，主要用来做调试、打印日志、数据监控、统一变换等。

- `beforeMiddleware`: 在数据流入管道的时候调用。
- `afterMiddleware`: 在数据流出管道的时候调用。

## `Store`: 数据池。

- `new Store(options)`: 实例化一个Store。

  ```js
  import {Store} from 'rx-hub';

  let store = new Store({ // options:
    // store 的名字，主要是方便调试
    name: 'storeName',

    // 初始化状态
    initialState: {
      loginUser: {
        username: 'season.chen'
      }
    },

    // 模块，key: value的形式
    // 每一个模块是一个Store实例
    modules: {
      user,
    },

    // 数据变更操作配置，定义这个store的所有数据变更
    mutations: {
      // payload: 传入数据
      // state: store的数据对象
      setLoginUser(payload, state) {
        state.loginUser = payload;
      },
    }
  })
  ```

- `store.commit(mutation, payload)`: 提交一个变更。

  - `mutation`: 变更名字，对应于sotre 的`mutations`。 如果mutation包含`.`分隔符, 则表示此次变更是提交给子模块的，而不是本store的变更。
  
    分隔符`.`前面的表示子模块的名字，后面表示提交给子模块的变更的名字。 如`store.commit('setLoginUser', {})`表示应用到本 `store` 的变更: `setLoginUser`。 而`store.commit('user.add', {})`表示应用模块: `user`的变更: `add`。

  - `payload`: 变更的数据。

- `store.subscribe(observer)`: 订阅变更。 如果订阅，store的每次`commit`提交都会通知观察者。

  ```js
  store.subscribe((state) => {
    // the store's new state is `state`
    console.log(state.loginUser);
  });
  ```

- `store.getState()`: 获取store的状态。

- `observable.subscribe(store)`: sotre 也可以作为观察者来进行变更数据, 数据流传入的数据格式必须是{payload, mutation}。

  ```js
  let newUser = {
    //...
  }

  Rx.Observable.of({
    // mutation
    mutation: 'setLoginUser',

    // payload
    payload: newUser,
  }).subscribe(store)

  // equal to:
  Rx.Observable.of({
    // mutation
    mutation: 'setLoginUser',

    // payload
    payload: newUser,
  }).subscribe(({mutation, payload}) => {
    store.commit(mutation, payload);
  });
  ```