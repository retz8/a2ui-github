import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

const GAPS = ['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'] as const;

/** Gallery: one horizontal surface per `gap` value, uniform buttons. */
export const stackGapFixture: Fixture = {
  name: 'stack-gap',
  messages: GAPS.flatMap(gap =>
    surface(`stack-gap-${gap}`, [
      {id: 'root', component: 'Stack', direction: 'horizontal', gap, children: ['b1', 'b2', 'b3']},
      ...labeledButton('b1', 'One'),
      ...labeledButton('b2', 'Two'),
      ...labeledButton('b3', 'Three'),
    ]),
  ),
};
