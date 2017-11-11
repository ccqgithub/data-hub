import hub from '../data/hubs/main';
import {Observable} from 'rxjs/Rx';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "../style/style.less";

let $app = document.getElementById('app');
let $filter = document.getElementById('filter');
let $btn = document.getElementById('search');
let $table = document.getElementById('table');

let userList = [];

// rerender table
function updateTable() {
  let filter = $filter.value.trim();
    let $rows = userList.filter(user => {
      return user.name.indexOf(filter) != -1;
    })
    .map((user, i) => {
      return `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>
            <button type="button" name="button" data-id="${user.id}">删除</button>
          </td>
        </tr>
      `;
    });

  // bind delete user
  $table.querySelector('tbody').innerHTML = $rows.join('');
  $table.querySelectorAll('tr > td > button').forEach(($btn, index) => {
    // delete
    Observable.fromEvent($btn, 'click')
      .pluck('target')
      .map(target => {
        let id = target.getAttribute('data-id');

        NProgress.start();

        return id;
      })
      .switchMap(hub.pipe('server.user.userDel'))
      .map(id => {
        return {
          mutation: 'user.delete',
          payload: id
        }
      })
      .concatMap(hub.pipe('store.commit'))
      .subscribe(() => {
        console.log('success')
        NProgress.done();
      }, (err) => {
        console.log(err);
        NProgress.done();
      });
  });
}

// watch state change
Observable.of({})
  .concatMap(hub.pipe('store.getState'))
  .subscribe((state) => {
    userList = state.user.list;
    updateTable();
  });

// filter input
Observable.fromEvent($filter, 'input')
  .debounceTime(500)
  .subscribe(() => {
    updateTable();
  });

// add new user
let addUserSubscription;
$btn.addEventListener('click', () => {
  // unsubscibe
  if (addUserSubscription) addUserSubscription.unsubscribe();

  let user = {
    id: Date.now(),
    name: 'user-' + Math.round(Math.random() * 1000000),
  }

  NProgress.start();

  addUserSubscription = Observable.of(user)
  .switchMap(hub.pipe('server.user.userAdd'))
  .map((user) => {
    return {
      mutation: 'user.add',
      payload: user
    }
  })
  .concatMap(hub.pipe('store.commit'))
  .subscribe(() => {
    console.log('success')
    NProgress.done();
  }, (err) => {
    console.log(err);
    NProgress.done();
  });
});
