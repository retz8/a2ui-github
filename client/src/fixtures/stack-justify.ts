import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

const JUSTIFIES = ['start', 'center', 'end', 'space-between', 'space-evenly'] as const;

/**
 * Gallery: one horizontal surface per `justify` value. The root Stack spans the full surface
 * width, so distribution (space-between / space-evenly) shows against buttons of varying width.
 */
export const stackJustifyFixture: Fixture = {
  name: 'stack-justify',
  messages: JUSTIFIES.flatMap(justify =>
    surface(`stack-justify-${justify}`, [
      {
        id: 'root',
        component: 'Stack',
        direction: 'horizontal',
        gap: 'normal',
        justify,
        children: ['b1', 'b2', 'b3'],
      },
      ...labeledButton('b1', 'Go'),
      ...labeledButton('b2', 'Submit'),
      ...labeledButton('b3', 'Cancel changes'),
    ]),
  ),
};
