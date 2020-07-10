import React from 'react';

import Calculator from './Calculator';

const App = props => {
  return (
    <div
      style={{
        width: 500,
        height: 'auto',
      }}
      className="mx-auto my-24 text-center"
    >
      <h1 className="font-bold text-xl">Statechart driven calculator</h1>
      <h3 className="font-bold text-xxl">Made with react and Xstate 4.x</h3>
      <Calculator />
    </div>
  );
};

export default App;
