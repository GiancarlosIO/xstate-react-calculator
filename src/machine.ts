import { Machine, assign } from 'xstate';

const not = fn => (...args) => !fn(...args);
const isZero = (context, event) => event.key === 0;
const isNotZero = not(isZero);
const isMinus = (context, event) => event.operator === '-';
const isNotMinus = not(isMinus);
const divideByZero = (context, event) => {
  return (
    (!context.operand2 || context.operand2 === '0.') && context.operator === '/'
  );
};
const notDivideByZero = not(divideByZero);

function doMath(operand1, operand2, operator) {
  switch (operator) {
    case '+':
      return +operand1 + +operand2;
    case '-':
      return +operand1 - +operand2;
    case '/':
      return +operand1 / +operand2;
    case 'x':
      return +operand1 * +operand2;
    default:
      return Infinity;
  }
}

type Context = {
  display: string;
  operand1?: string;
  operand2?: string;
  operator?: string;
};

const calMachine = Machine<Context>(
  {
    id: 'calcMachine',
    context: {
      display: '0.',
      operand1: undefined,
      operand2: undefined,
      operator: undefined,
    },
    strict: true,
    initial: 'start',
    on: {
      CLEAR_EVERYTHING: {
        target: '.start',
        actions: ['reset'],
      },
    },
    states: {
      start: {
        on: {
          NUMBER: [
            {
              cond: 'isZero',
              target: 'operand1.zero',
              actions: ['defaultReadout'],
            },
            {
              cond: 'isNotZero',
              target: 'operand1.before_decimal_point',
              actions: ['setReadoutNum'],
            },
          ],
          OPERATOR: {
            cond: 'isMinus',
            target: 'negative_number',
            actions: ['startNegativeNumber'],
          },
          DECIMAL_POINT: {
            target: 'operand1.after_decimal_point',
            actions: ['defaultReadout'],
          },
        },
      },
      operand1: {
        on: {
          OPERATOR: {
            target: 'operator_entered',
            actions: ['recordOperator'],
          },
          PERCENTAGE: {
            target: 'result',
            actions: ['storeResultAsOperand2', 'computePercentage'],
          },
          CLEAR_ENTRY: {
            target: 'operand1',
            actions: ['defaultReadout'],
          },
        },
        initial: 'zero',
        states: {
          zero: {
            on: {
              NUMBER: {
                target: 'before_decimal_point',
                actions: 'setReadoutNum',
              },
              DECIMAL_POINT: 'after_decimal_point',
            },
          },
          before_decimal_point: {
            on: {
              NUMBER: {
                target: 'before_decimal_point',
                actions: ['appendNumBeforeDecimal'],
              },
              DECIMAL_POINT: 'after_decimal_point',
            },
          },
          after_decimal_point: {
            on: {
              NUMBER: {
                target: 'after_decimal_point',
                actions: ['appendNumAfterDecimal'],
              },
            },
          },
        },
      },
      negative_number: {
        on: {
          NUMBER: [
            {
              cond: 'isZero',
              target: 'operand1.zero',
              actions: ['defaultNegativeReadout'],
            },
            {
              cond: 'isNotZero',
              target: 'operand1.before_decimal_point',
              actions: ['setNegativeReadoutNum'],
            },
          ],
          DECIMAL_POINT: {
            target: 'operand1.after_decimal_point',
            actions: ['defaultNegativeReadout'],
          },
          CLEAR_ENTRY: {
            target: 'start',
            actions: ['defaultReadout'],
          },
        },
      },
      operator_entered: {
        on: {
          OPERATOR: [
            {
              cond: 'isNotMinus',
              target: 'operator_entered',
              actions: 'setOperator',
            },
            {
              cond: 'isMinus',
              target: 'negative_number_2',
              actions: ['startNegativeNumber'],
            },
          ],
          NUMBER: [
            {
              cond: 'isZero',
              target: 'operand2.zero',
              actions: ['defaultReadout', 'saveOperand2'],
            },
            {
              cond: 'isNotZero',
              target: 'operand2.before_decimal_point',
              actions: ['setReadoutNum', 'saveOperand2'],
            },
          ],
          DECIMAL_POINT: {
            target: 'operand2.after_decimal_point',
            actions: ['defaultReadout'],
          },
        },
      },
      operand2: {
        on: {
          OPERATOR: [
            {
              cond: 'notDivideByZero',
              target: 'operator_entered',
              actions: [
                'storeResultAsOperand2',
                'compute',
                'storeResultAsOperand1',
                'setOperator',
              ],
            },
            {
              target: 'alert',
            },
          ],
          EQUALS: [
            {
              cond: 'notDivideByZero',
              target: 'result',
              actions: ['storeResultAsOperand2', 'compute'],
            },
            {
              target: 'alert',
            },
          ],
          CLEAR_ENTRY: {
            target: 'operand2.zero',
            actions: ['defaultReadout'],
          },
        },
        initial: 'zero',
        states: {
          zero: {
            on: {
              NUMBER: {
                target: 'before_decimal_point',
                actions: ['setReadoutNum'],
              },
              DECIMAL_POINT: 'after_decimal_point',
            },
          },
          before_decimal_point: {
            on: {
              NUMBER: {
                target: 'before_decimal_point',
                actions: ['appendNumBeforeDecimal'],
              },
              DECIMAL_POINT: 'after_decimal_point',
            },
          },
          after_decimal_point: {
            on: {
              NUMBER: {
                target: 'after_decimal_point',
                actions: 'appendNumAfterDecimal',
              },
            },
          },
        },
      },
      negative_number_2: {
        on: {
          NUMBER: [
            {
              cond: 'isZero',
              target: 'operand2.zero',
              actions: ['defaultNegativeReadout'],
            },
            {
              cond: 'isNotZero',
              target: 'operand2.before_decimal_point',
              actions: ['setNegativeReadoutNum'],
            },
          ],
          DECIMAL_POINT: {
            target: 'operand2.after_decimal_point',
            actions: ['defaultNegativeReadout'],
          },
          CLEAR_ENTRY: {
            target: 'operator_entered',
            actions: ['defaultReadout'],
          },
        },
      },
      result: {
        on: {
          NUMBER: [
            {
              cond: 'isZero',
              target: 'operand1',
              actions: ['defaultReadout'],
            },
            {
              cond: 'isNotZero',
              target: 'operand1.before_decimal_point',
              actions: ['setReadoutNum'],
            },
          ],
          PERCENTAGE: {
            target: 'result',
            actions: ['storeResultAsOperand2', 'computePercentage'],
          },
          OPERATOR: {
            target: 'operator_entered',
            actions: ['storeResultAsOperand1', 'recordOperator'],
          },
          CLEAR_ENTRY: {
            target: 'start',
            actions: ['defaultReadout'],
          },
        },
      },
      alert: {
        invoke: {
          src: (context, event) => () => {
            // eslint-disable-next-line no-alert
            alert('Cannot divide by zero!');
            return Promise.resolve();
          },
          onDone: {
            target: 'start',
            actions: ['reset'],
          },
        },
      },
    },
  },
  {
    guards: {
      isMinus,
      isNotMinus,
      isZero,
      isNotZero,
      notDivideByZero,
    },
    actions: {
      defaultReadout: assign({
        display: () => {
          console.log('defaultReadout');

          return '0.';
        },
      }),

      defaultNegativeReadout: assign({
        display: () => '-0.',
      }),

      appendNumBeforeDecimal: assign({
        display: (context, event) => {
          // from '123.' => '1234.'
          return `${context.display.slice(0, -1)}${event.key}.`;
        },
      }),

      appendNumAfterDecimal: assign({
        display: (context, event) => {
          return `${context.display}${event.key}`;
        },
      }),

      setReadoutNum: assign({
        display: (context, event) => {
          return `${event.key}.`;
        },
      }),

      setNegativeReadoutNum: assign({
        display: (context, event) => `-${event.key}.`,
      }),

      startNegativeNumber: assign({
        display: () => '-',
      }),

      recordOperator: assign({
        operand1: context => context.display,
        operator: (context, event) => event.operator,
      }),

      setOperator: assign({
        operator: (context, event) => context.operator,
      }),

      computePercentage: assign({
        display: (context, event) => (+context.display / 100).toString(),
      }),

      compute: assign({
        display: (context, event) => {
          const result = doMath(
            context.operand1,
            context.operand2,
            context.operator,
          );

          console.log(
            `doing calculation ${context.operand1} ${context.operator} ${context.operand2} = ${result}`,
          );

          return result.toString();
        },
      }),

      storeResultAsOperand1: assign({
        operand1: context => context.display,
      }),

      storeResultAsOperand2: assign({
        operand2: context => context.display,
      }),

      saveOperand2: assign({
        operand2: (context, event) => context.display,
      }),

      reset: assign({
        display: () => '0.',
        operand1: (context, event) => undefined,
        operand2: () => undefined,
        operator: () => undefined,
      }),
    },
  },
);

export default calMachine;
