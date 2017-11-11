# createRxHubComponent

## 构建一个基类, 绑定hub、store，其他组件继承这个基类。

然后继承这个基类的会有如下属性， 这些属性的名字都可以在使用插件的时候自定义，组件如果没有`componentWillUnMount`钩子，默认会在`componentWillUnMount`钩子上调用`this.$unsubscribe()`。

如果组件自定义了 componentWillUnMount ，最好在 componentWillUnMount 中调用`this.$unsubscribe()`。

- `this.$store`: Store实例。
- `this.$hub`: 数据板实例
- `this.$subs`: 用来绑定订阅，组件内新建订阅的时候最好绑定在这上面，组件离开时会取消这些订阅（例：`this.$subs.addUser = Observable.of(1).subscribe(item => {})`）。
- `this.$unsubscribe(key)`: 取消一个绑定在`this.$subs`上的订阅，不传key则取消所有订阅。

```js
import React from 'react';
import {createRxHubComponent} from 'rx-hub';
import hub from '../data/hubs/main';
import store from '../data/stores/main';

const Base = createRxHubComponent({
  hub,
  store,
  storeKey = '$store',
  hubKey = '$hub',
  subscriptionsKey = '$subs',
  unsubscribeKey = '$unsubscribe'
}, React);

export default Base;

```

## 组件里使用store状态

```js
import React from 'react';
import BaseComponent from './Base';

class App extends BaseComponent {
  constructor(props) {
    super(props, true);

    // init state
    this.state = {
      state: this.$store.state.user.list,
    };

    // 订阅store变更，改变state
    this.$subs.store = this.$store.subscribe(state => {
      this.setState({
        state: state
      });
    });
  }
}

export default App;

```

## 数据变换: 每一次数据变换开始一个管道。

```js
class APP extends BaseComponent {
  // ...
  addUser() {
    // 放弃上次订阅，如果有
    this.$unsubscribe('addItem');

    // 开始一个数据流
    NProgress.start();
    this.$subs.addItem = Rx.Observable
      // 初始化数据
      .of({
        id: Date.now(),
        name: 'user-' + Math.round(Math.random() * 1000000),
      })
      // 服务器添加
      .switchMap(this.$hub.pipe('server.user.userAdd'))
      // 构建store转换数据
      .map((user) => {
        return {
          mutation: 'user.add',
          payload: user
        }
      })
      // 提交store变换
      .concatMap(this.$hub.pipe('store.commit'))
      // 订阅
      .subscribe(() => {
        console.log('success')
        NProgress.done();
      }, (err) => {
        console.log(err);
        NProgress.done();
      });
  }
}
```
