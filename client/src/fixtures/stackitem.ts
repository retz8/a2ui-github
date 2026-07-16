import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

/** Base fixture: a horizontal Stack of three default Stack.Items, each wrapping a Button. */
export const stackitemFixture: Fixture = {
  name: 'stackitem',
  messages: surface('stackitem', [
    {
      id: 'root',
      component: 'Stack',
      direction: 'horizontal',
      gap: 'normal',
      children: ['si1', 'si2', 'si3'],
    },
    {id: 'si1', component: 'StackItem', children: ['b1']},
    {id: 'si2', component: 'StackItem', children: ['b2']},
    {id: 'si3', component: 'StackItem', children: ['b3']},
    ...labeledButton('b1', 'One'),
    ...labeledButton('b2', 'Two'),
    ...labeledButton('b3', 'Three'),
  ]),
};
