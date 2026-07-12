import {labeledButton, surface} from './stack-helpers';
import type {Fixture} from './types';

const WRAPS = ['wrap', 'nowrap'] as const;

// Six wide buttons whose combined width exceeds the fixed 1024px baseline viewport, so `wrap`
// flows onto a second line while `nowrap` keeps them on one (overflowing) line.
const LABELS = [
  'First wide button',
  'Second wide button',
  'Third wide button',
  'Fourth wide button',
  'Fifth wide button',
  'Sixth wide button',
];

/** Gallery: `wrap` vs `nowrap`, with enough wide children to overflow one line. */
export const stackWrapFixture: Fixture = {
  name: 'stack-wrap',
  messages: WRAPS.flatMap(wrap =>
    surface(`stack-wrap-${wrap}`, [
      {
        id: 'root',
        component: 'Stack',
        direction: 'horizontal',
        gap: 'normal',
        wrap,
        children: LABELS.map((_, i) => `b${i}`),
      },
      ...LABELS.flatMap((label, i) => labeledButton(`b${i}`, label)),
    ]),
  ),
};
