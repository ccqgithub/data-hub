import React from 'react';
import ReactDOM from 'react-dom';
import hub from '../data/hubs/main';
import {Observable} from 'rxjs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import "../style/style.less";

class Page extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
      filter: '',
      userList: []
    }
  }

  componentDidMount() {
    Observable.of({})
    .concatMap(hub.pipe('store.getState'))
    .subscribe((state) => {
      this.setState({
        userList: state.user.list
      })
    });
  }

  filterChange(event) {
    this.setState({
      filter: event.target.value.trim()
    });
  }

  addUser() {
    // unsubscibe
    if (this.addUserSubscription) this.addUserSubscription.unsubscribe();
  
    let user = {
      id: Date.now(),
      name: 'user-' + Math.round(Math.random() * 1000000),
    }
  
    NProgress.start();
  
    this.addUserSubscription = Observable.of(user)
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
  }

  deletUser(user) {
    // unsubscibe
    if (this.delUserSubscription) this.delUserSubscription.unsubscribe();
  
    NProgress.start();
  
    this.delUserSubscription = Observable.of(user.id)
    .switchMap(hub.pipe('server.user.userDel'))
    .map((userId) => {
      return {
        mutation: 'user.delete',
        payload: userId
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
  }
  
  render() {
    let filter = this.state.filter;
    let $trs = this.state.userList
      .filter(user => {
        return user.name.indexOf(filter) != -1;
      })
      .map(user => {
        return (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>
              <button 
                type="button" 
                name="button" 
                onClick={() => this.deletUser.bind(this)(user)}
              >删除</button>
            </td>
          </tr>
        );
      });

    return (
      <div className="app">
        <div className="topBar">
          user: username
        </div>
    
        <div className="filter">
          <input type="text" placeholder="关键字" onInput={this.filterChange.bind(this)}/>
          <button type="button" name="button" onClick={this.addUser.bind(this)}>
            添加
          </button>
        </div>
    
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>用户名</th>
              <th>操作</th>
            </tr>  
          </thead>
          <tbody>
            {$trs}
          </tbody>
        </table>
      </div>
    )
  }
}

ReactDOM.render(
  <Page></Page>,
  document.getElementById('app')
);