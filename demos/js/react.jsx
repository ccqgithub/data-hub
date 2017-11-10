import './lib/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../react/App';
import '../style/style.less';
import 'nprogress/nprogress.css';

ReactDOM.render(
  <App></App>,
  document.getElementById('app')
);
