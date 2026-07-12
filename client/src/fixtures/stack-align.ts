import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

const ALIGNS = ['stretch', 'start', 'center', 'end', 'baseline'] as const;

/**
 * Gallery: one horizontal surface per `align` value. Buttons of differing `size` give the height
 * variation that makes cross-axis alignment legible.
 */
export const stackAlignFixture: Fixture = {
  name: 'stack-align',
  messages: ALIGNS.flatMap(align =>
    surface(`stack-align-${align}`, [
      {id: 'root', component: 'Stack', direction: 'horizontal', gap: 'normal', align, children: ['b1', 'b2', 'b3']},
      ...labeledButton('b1', 'Small', {size: 'small'}),
      ...labeledButton('b2', 'Medium', {size: 'medium'}),
      ...labeledButton('b3', 'Large', {size: 'large'}),
    ]),
  ),
};
