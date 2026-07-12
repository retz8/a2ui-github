import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

/** Single: `paddingInline` insets only the horizontal axis (the scale magnitudes are covered by stack-padding). */
export const stackPaddinginlineFixture: Fixture = {
  name: 'stack-paddinginline',
  messages: surface('stack-paddinginline', [
    {id: 'root', component: 'Stack', direction: 'horizontal', gap: 'normal', paddingInline: 'spacious', children: ['b1', 'b2', 'b3']},
    ...labeledButton('b1', 'One'),
    ...labeledButton('b2', 'Two'),
    ...labeledButton('b3', 'Three'),
  ]),
};
