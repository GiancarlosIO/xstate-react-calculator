import React from 'react';
import ReactDOM from 'react-dom';

// import './tailwind.css';

import App from './App';

import { inspect } from '@xstate/inspect';


const useIframe = true;

if(useIframe){
  inspect({
    // options
    iframe: ()=>document.getElementById("viz") as HTMLIFrameElement,
    url: "https://stately.ai/viz?inspect"
  });
} else {
inspect({
  // options
  iframe: false,
  url: "https://stately.ai/viz?inspect"
});
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root'),
);
