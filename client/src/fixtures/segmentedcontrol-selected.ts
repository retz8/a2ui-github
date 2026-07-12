import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Visually-distinct state: a literal non-zero `selectedIndex` (1) makes the 2nd segment active. */
export const segmentedcontrolSelectedFixture: Fixture = {
  name: 'segmentedcontrol-selected',
  messages: surface('segmentedcontrol-selected', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 1,
      accessibility: {label: 'File view'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Raw'},
    {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
  ]),
};
