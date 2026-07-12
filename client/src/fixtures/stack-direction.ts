import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

const DIRECTIONS = ['horizontal', 'vertical'] as const;

/** Gallery: one surface per `direction` value. */
export const stackDirectionFixture: Fixture = {
  name: 'stack-direction',
  messages: DIRECTIONS.flatMap(direction =>
    surface(`stack-direction-${direction}`, [
      {id: 'root', component: 'Stack', direction, gap: 'normal', children: ['b1', 'b2', 'b3']},
      ...labeledButton('b1', 'One'),
      ...labeledButton('b2', 'Two'),
      ...labeledButton('b3', 'Three'),
    ]),
  ),
};
