import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Visually-distinct state: `fullWidth` stretches the three segments across a wide container. */
export const segmentedcontrolFullwidthFixture: Fixture = {
  name: 'segmentedcontrol-fullwidth',
  messages: surface('segmentedcontrol-fullwidth', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      fullWidth: true,
      accessibility: {label: 'File view'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Raw'},
    {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
  ]),
};
