import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Visually-distinct state: the middle segment is `disabled` and cannot be selected. */
export const segmentedcontrolbuttonDisabledFixture: Fixture = {
  name: 'segmentedcontrolbutton-disabled',
  messages: surface('segmentedcontrolbutton-disabled', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      accessibility: {label: 'File view'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Raw', disabled: true},
    {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
  ]),
};
