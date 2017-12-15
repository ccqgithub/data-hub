# 安装

## 安装依赖

> data-hub 依赖 [RxJS@5.x](https://github.com/ReactiveX/RxJS)。


```sh
# install rxjs
npm i rxjs@5.x
```

## npm 安装

```sh
# install data-hub
npm i data-hub@latest -S
```

## 使用

> es6 版

```js
import {Sotre, Hub, logMiddleware, VuePlugin, createRxHubComponent} from 'data-hub';
```

> es6 各部分单独使用

```js
// store
import Sotre from 'data-hub/src/store';

// hub
import Hub from 'data-hub/src/hub';

// middleware
import Sotre from 'data-hub/src/middleware/log';

// tool
import VuePlugin from 'data-hub/src/tool/vue';
import createRxHubComponent from 'data-hub/src/tool/react';
```

> 打包好的 commonjs 版（里面的 `process.ENV.NODE_ENV` 未编译）

```js
import {
  Sotre,
  Hub,
  logMiddleware,
  VuePlugin,
  createRxHubComponent
} from 'data-hub/dist/data-hub.common';
```

> umd 开发版

`dist/data-hub/data-hub.js`

> umd 生产环境

`dist/data-hub/data-hub.min.js`
