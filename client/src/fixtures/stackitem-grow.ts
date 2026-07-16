import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * `grow`: the middle Stack.Item has `grow: true`, so in a horizontal Stack wider than its content
 * it expands to fill the free space while the others keep their natural size.
 */
export const stackitemGrowFixture: Fixture = {
  name: 'stackitem-grow',
  messages: surface('stackitem-grow', [
    {
      id: 'root',
      component: 'Stack',
      direction: 'horizontal',
      gap: 'normal',
      children: ['si1', 'si2', 'si3'],
    },
    {id: 'si1', component: 'StackItem', children: ['b1']},
    {id: 'si2', component: 'StackItem', grow: true, children: ['b2']},
    {id: 'si3', component: 'StackItem', children: ['b3']},
    ...labeledButton('b1', 'One'),
    ...labeledButton('b2', 'Grows to fill'),
    ...labeledButton('b3', 'Three'),
  ]),
};
