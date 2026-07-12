import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Path binding + two-way write-back: `selectedIndex` is bound to `/view` (initially 0, Preview
 * active). Clicking a segment writes its index back through the binder's auto-generated setter,
 * and the control re-renders with that segment active. Behavior is proven in the interaction test;
 * not visually baselined (pixels identical to a literal-selected fixture).
 */
export const segmentedcontrolBoundFixture: Fixture = {
  name: 'segmentedcontrol-bound',
  messages: surface(
    'segmentedcontrol-bound',
    [
      {
        id: 'root',
        component: 'SegmentedControl',
        selectedIndex: {path: '/view'},
        accessibility: {label: 'File view'},
        children: ['s0', 's1', 's2'],
      },
      {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
      {id: 's1', component: 'SegmentedControlButton', label: 'Raw'},
      {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
    ],
    {view: 0},
  ),
};
