import React from 'react';

import Calculator from './Calculator';

const App = () => {
  return (
    <div
      style={{
        width: 500,
        height: 'auto',
        margin: '0 auto',
        marginTop: 96,
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h1
        style={{
          fontWeight: 'bold',
          fontSize: 32,
        }}
      >
        Statechart driven calculator
      </h1>
      <h3
        style={{
          fontWeight: 'bold',
          fontSize: 18,
        }}
      >
        Made with react and Xstate 4.x
      </h3>
      <Calculator />
    </div>
  );
};

export default App;
