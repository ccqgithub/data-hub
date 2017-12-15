# VuePlugin

## 绑定插件

```js
import Vue from 'vue';
import {VuePlugin} from 'data-hub';

Vue.use(VuePlugin, {
  storeOptionKey: 'store',
  storeKey: '$store',
  hubOptionKey: 'hub',
  hubKey: '$hub',
  stateKey: '$state',
  subscriptionsKey: '$subs'
});
```

## 在根组件绑定hub 和 store

> 在根组件上绑定后，每个组件中会有异性几个属性, 这些属性的名字都可以在使用插件的时候自定义。

- `vm.$store`: Store实例。
- `vm.$hub`: 数据板实例
- `vm.$state`: 响应式的state，关联到`store.state`.
- `vm.$subs`: 用来绑定订阅，组件内新建订阅的时候最好绑定在这上面，组件离开时会取消这些订阅（例：`vm.$subs.addUser = Observable.of(1).subscribe(item => {})`）。
- `vm.$unsubscribe(key)`: 取消一个绑定在`vm.$subs`上的订阅，不传key则取消所有订阅。

```js
import hub from '../data/hubs/main';
import store from '../data/stores/main';

new Vue({
  store,
  hub,
  //
  computed: {
    user() {
      return this.$sotre.state.user;
    }
  }
})
```

## 使用

> 获取数据: 一般直接从`vm.$store.state`获取，或者通过计算属性获取。

```js
export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    console.log(this.$store.state.user)
  }
};
```

> 数据变换: 每一次数据变换开始一个管道。

```js
export default {
  methods: {
    addItem() {
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
};
```

> 不能直接更改state，如果要把store的一些值初始化为data，可以用`store.copy`。

```js
data () {
  const store = this.$store;

  return {
    user: store.copy(store)
  }
}
```
