# 数据池：Store

- `new Store(options)`: 实例化一个Store。

  ```js
  import {Store} from 'rx-hub';

  let store = new Store({ // options:
    // 开启调试模式后，每一次commit都会打印出来
    debug: process.env.NODE_ENV !== 'production',

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

- `store.copy(nodePath)`: 克隆`state`的一个节点。

  ```js
  let userList = store.copy('user.list');
  ```

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
