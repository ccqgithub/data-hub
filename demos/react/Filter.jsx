import React from 'react';
import {Observable} from 'rxjs/Rx';
import NProgress from 'nprogress';
import BaseComponent from './Base';

class Filter extends BaseComponent {
  constructor(props) {
    super(props);

    // init state
    this.state = {

    }
  }

  filterChange(event) {
    this.props.filterChange(event.target.value);
  }

  addUser() {
    // unsubscibe
    this.$unsubscribe('addUser');

    let user = {
      id: Date.now(),
      name: 'user-' + Math.round(Math.random() * 1000000),
    }

    NProgress.start();

    this.$subs.addUser = Observable
    .of(user)
    .switchMap(this.$hub.pipe('server.user.userAdd'))
    .map((user) => {
      return {
        mutation: 'user.add',
        payload: user
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

    return (
      <div className="filter">
        <input
          type="text"
          placeholder="关键字"
          value={this.props.filter}
          onInput={this.filterChange.bind(this)}
        />
        <button
          type="button"
          name="button"
          onClick={this.addUser.bind(this)}
        >
          添加
        </button>
      </div>
    )
  }
}

export default Filter;
