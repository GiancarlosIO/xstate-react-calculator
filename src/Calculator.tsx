import React from 'react';
import { useMachine } from '@xstate/react';
import styled from 'styled-components';

import machine from './machine';

const Input = styled.input`
  font-size: 32px;
  color: #333;
  text-align: right;
  padding: 5px 13px;
  width: 100%;
  border: none;
  border-bottom: 1px solid gray;
  box-sizing: border-box;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 22px;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border-radius: 2px;
  border: 0;
  outline: none;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
  &:active {
    background: #999;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);
  }

  &.two-span {
    grid-column: span 2;
    background-color: #3572db;
  }
`;

const ExtraData = styled.div`
  margin-top: 8px;
  padding: 20px 16px;
  p,
  pre,
  code {
    text-align: left;
    margin: 0;
    padding: 0;
    margin-top: 12px;
  }
`;

const buttons = [
  'C',
  'CE',
  '/',
  '7',
  '8',
  '9',
  'x',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '0',
  '.',
  '=',
  '%',
];

function isOperator(text) {
  return '+-x/'.indexOf(text) > -1;
}

const Calculator = () => {
  const [state, sendMachine] = useMachine(machine, {});

  function send(event, payload) {
    console.log('Event - Payload', { event, payload });

    sendMachine(event, payload);
  }

  const handleButtonClick = item => () => {
    if (Number.isInteger(+item)) {
      send('NUMBER', { key: +item });
    } else if (isOperator(item)) {
      send('OPERATOR', { operator: item });
    } else if (item === 'C') {
      send('CLEAR_EVERYTHING', {});
    } else if (item === '.') {
      send('DECIMAL_POINT', {});
    } else if (item === '%') {
      send('PERCENTAGE', {});
    } else if (item === 'CE') {
      send('CLEAR_ENTRY', {});
    } else {
      send('EQUALS', {});
    }
  };

  return (
    <div
      style={{
        width: 300,
        height: 'auto',
        border: '1px solid rgba(0,0,0,0.05)',
        margin: '0 auto',
        marginTop: 16,
      }}
    >
      <div>
        <Input
          type="text"
          value={state.context.display}
          disabled
          style={{
            width: '100%',
            textAlign: 'right',
            padding: '8px 20px',
            border: 'none',
            outline: 'none',
          }}
        />
      </div>
      <ButtonGrid
        style={{
          padding: '8px 20px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {buttons.map((btn, index) => (
          <Button
            className={btn === 'C' ? 'two-span' : ''}
            type="button"
            key={index}
            onClick={handleButtonClick(btn)}
          >
            {btn}
          </Button>
        ))}
      </ButtonGrid>

      <ExtraData>
        <p className="mt-1">State</p>
        <pre>
          <code>{JSON.stringify(state.value, null, 2)}</code>
        </pre>
        <p className="mt-1">Context:</p>
        <pre>
          <code>{JSON.stringify(state.context, null, 2)}</code>
        </pre>
      </ExtraData>
    </div>
  );
};

export default Calculator;
