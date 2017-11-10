import React from 'react';
import {Observable} from 'rxjs/Rx';
import NProgress from 'nprogress';
import BaseComponent from './Base';

class List extends BaseComponent {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      list: this.$store.state.user.list,
    }

    this.$subs.store = this.$store.subscribe(state => {
      this.setState({
        list: state.user.list
      });
    });
  }

  componentDidMount() {

  }

  deletUser(user) {
    this.$unsubscribe('deletUser');

    NProgress.start();

    this.$subs.deletUser = Observable
    .of(user.id)
    .switchMap(this.$hub.pipe('server.user.userDel'))
    .map((userId) => {
      return {
        mutation: 'user.delete',
        payload: userId
      }
    })
    .concatMap(this.$hub.pipe('store.commit'))
    .subscribe(() => {
      console.log('success')
      NProgress.done();
    }, (err) => {
      console.log(err);
      NProgress.done();
    });
  }

  render() {
    let filter = this.props.filter;
    let $trs = this.state.list
      .filter(user => {
        if (!filter) return true;
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
    )
  }
}

export default List;
