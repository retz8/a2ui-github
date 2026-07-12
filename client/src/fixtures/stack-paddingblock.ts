import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

/** Single: `paddingBlock` insets only the vertical axis (the scale magnitudes are covered by stack-padding). */
export const stackPaddingblockFixture: Fixture = {
  name: 'stack-paddingblock',
  messages: surface('stack-paddingblock', [
    {id: 'root', component: 'Stack', direction: 'horizontal', gap: 'normal', paddingBlock: 'spacious', children: ['b1', 'b2', 'b3']},
    ...labeledButton('b1', 'One'),
    ...labeledButton('b2', 'Two'),
    ...labeledButton('b3', 'Three'),
  ]),
};
