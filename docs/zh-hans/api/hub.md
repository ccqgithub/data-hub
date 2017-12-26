# 数据板：Hub

- `let hub = new Hub(options)`: 创建实`Hub`例.

```js
import {Hub} from 'data-hub';

const hub = new Hub({
  // 管道进入前的中间件
  beforeMiddlewares: [logMiddleware],
  // 管道流程后经过的中间件
  afterMiddlewares: [logMiddleware],
});
```

- `hub.Rx`: useRx(Rx)中的`Rx`.

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
  import {logMiddleware} from 'data-hub';

  hub.addMiddleware('before', logMiddleware);
  ```

## `Middleware`: 中间件。

> 一个中间件其实就是一个`Converter`, 只是放置的位置不一样而已。中间件分为两种类型，`beforeMiddleware`和`afterMiddleware`。

> 中间件每个位置可以安装多个，主要用来做调试、打印日志、数据监控、统一变换等。

- `beforeMiddleware`: 在数据流入管道的时候调用。
- `afterMiddleware`: 在数据流出管道的时候调用。
