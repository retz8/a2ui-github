import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Responsive-arm demo: `direction` is a `{narrow, regular, wide}` map — vertical on narrow
 * viewports, horizontal otherwise. The single-viewport baseline captures the regular width
 * (horizontal); the cross-viewport effect is verified manually by resizing. Proves the
 * responsive object is accepted and forwarded (the render test asserts the forwarding).
 */
export const stackResponsiveFixture: Fixture = {
  name: 'stack-responsive',
  messages: surface('stack-responsive', [
    {
      id: 'root',
      component: 'Stack',
      gap: 'normal',
      direction: {narrow: 'vertical', regular: 'horizontal', wide: 'horizontal'},
      children: ['b1', 'b2', 'b3'],
    },
    ...labeledButton('b1', 'One'),
    ...labeledButton('b2', 'Two'),
    ...labeledButton('b3', 'Three'),
  ]),
};
