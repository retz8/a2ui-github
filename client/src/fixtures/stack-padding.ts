import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

const PADDINGS = ['none', 'tight', 'condensed', 'cozy', 'normal', 'spacious'] as const;

/**
 * Gallery: one surface per `padding` value. The padding insets the button group from the
 * surface origin, so the offset grows across the gallery.
 */
export const stackPaddingFixture: Fixture = {
  name: 'stack-padding',
  messages: PADDINGS.flatMap(padding =>
    surface(`stack-padding-${padding}`, [
      {
        id: 'root',
        component: 'Stack',
        direction: 'horizontal',
        gap: 'normal',
        padding,
        children: ['b1', 'b2', 'b3'],
      },
      ...labeledButton('b1', 'One'),
      ...labeledButton('b2', 'Two'),
      ...labeledButton('b3', 'Three'),
    ]),
  ),
};
