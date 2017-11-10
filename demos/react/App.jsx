import React from 'react';
import {Observable} from 'rxjs/Rx';
import NProgress from 'nprogress';
import BaseComponent from './Base';
import Filter from './Filter';
import List from './List';

class App extends BaseComponent {
  constructor(props) {
    super(props, true);

    // init state
    this.state = {
      filter: ''
    }
  }

  componentDidMount() {
    //
  }

  render() {
    let filter = this.state.filter;

    return (
      <div className="app">
        <div className="topBar">
          user: username
        </div>

        <Filter
          filter={this.state.filter}
          filterChange={val => this.setState({filter: val})}
        ></Filter>

        <List filter={this.state.filter}></List>
      </div>
    )
  }
}

export default App;
