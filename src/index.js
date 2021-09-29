import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { HashRouter as Router } from 'react-router-dom';

import { API_AUTH_TOKEN } from './utils/consts';

import axios from 'axios';

axios.defaults.headers.common['Authorization'] = `Bearer ${API_AUTH_TOKEN}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';

console.log(Object.keys(localStorage));

const defaultState = {
  pinnedStops: Object.keys(localStorage).filter(ls => ls.startsWith('pinned-stop')),
  favoriteStop: Object.keys(localStorage).find(ls => ls.startsWith('fave-stop'))
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
