# 安装

## 安装依赖

> rx-hub 依赖 [RxJS@5.x](https://github.com/ReactiveX/RxJS)。


```sh
# install rxjs
npm i rxjs@5.x
```

## npm 安装

```sh
# install rx-hub
npm i rx-hub@latest -S
```

## 使用

> es6 版

```js
import {Sotre, Hub, logMiddleware, VuePlugin, createRxHubComponent} from 'rx-hub';
```

> es6 各部分单独使用

```js
// store
import Sotre from 'rx-hub/src/store';

// hub
import Sotre from 'rx-hub/src/hub';

// middleware
import Sotre from 'rx-hub/src/middleware/log';

// tool
import VuePlugin from 'rx-hub/src/tool/vue';
import createRxHubComponent from 'rx-hub/src/tool/react';
```

> 打包好的 commonjs 版（里面的 `process.ENV.NODE_ENV` 未编译）

```js
import {
  Sotre,
  Hub,
  logMiddleware,
  VuePlugin,
  createRxHubComponent
} from 'rx-hub/dist/rx-hub.common';
```

> umd 开发版

`dist/rx-hub/rx-hub.js`

> umd 生产环境

`dist/rx-hub/rx-hub.min.js`
