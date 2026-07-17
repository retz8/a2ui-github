import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * `shrink`: three wide Stack.Items whose natural widths exceed the fixed 1024px baseline
 * viewport. The two `shrink: true` items compress to fit; the middle `shrink: false` item keeps
 * its natural size, so the difference is visible under the overflow.
 */
export const stackitemShrinkFixture: Fixture = {
  name: 'stackitem-shrink',
  messages: surface('stackitem-shrink', [
    {
      id: 'root',
      component: 'Stack',
      direction: 'horizontal',
      gap: 'normal',
      children: ['si1', 'si2', 'si3'],
    },
    {id: 'si1', component: 'StackItem', shrink: true, children: ['b1']},
    {id: 'si2', component: 'StackItem', shrink: false, children: ['b2']},
    {id: 'si3', component: 'StackItem', shrink: true, children: ['b3']},
    ...labeledButton('b1', 'First shrinkable wide item'),
    ...labeledButton('b2', 'Middle fixed-width wide item'),
    ...labeledButton('b3', 'Third shrinkable wide item'),
  ]),
};
