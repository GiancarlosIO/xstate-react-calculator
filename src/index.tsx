import React from 'react';
import ReactDOM from 'react-dom';

// import './tailwind.css';

import App from './App';

import { inspect } from '@xstate/inspect';

inspect({
  // options
  iframe: false,
  url: "https://statecharts.io/inspect"
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root'),
);
