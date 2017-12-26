## 管道连接

data-hub 的一个操作产生一个`临时数据流`，数据流的中间可能会 连接很多`管道`. 由于管道是是通过`转换器`定义的，转换器接收一个数据，产生一个数据流。

所以，管道的连接一般使用如下的RxJS数据流的连接[操作：operators](http://reactivex.io/rxjs/manual/overview.html#operators):

- `concatMap`: 旧的数据流中的每一数据发射，映射为一个新的数据流，并且大平（新的等待旧的结束）
- `exhaustMap`：旧的数据流中的每一数据发射，映射为一个新的数据流（一个时刻只能有一个流，如果旧的流还未完成，新的将被忽略)
- `switchMap`：旧的数据流中的每一数据发射，映射为一个新的数据流（一个时刻只能有一个流，新的来临时drop旧的)。

```js
Observable.fromEvent($btn, 'click')
  // 防抖动
  .debounceTime(300)
  .pluck('target')
  .map(target => {
    let id = target.getAttribute('data-id');

    NProgress.start();

    return id;
  })
  // 连接管道，新的服务器请求到来，如果旧的请求未返回，则忽略旧的
  .switchMap(hub.pipe('server.user.userDel'))
  .map(id => {
    return {
      mutation: 'user.delete',
      payload: id
    }
  })
  // 连接管道
  .concatMap(hub.pipe('store.commit'))
  .subscribe(() => {
    console.log('success')
    NProgress.done();
  }, (err) => {
    console.log(err);
    NProgress.done();
  });
```
