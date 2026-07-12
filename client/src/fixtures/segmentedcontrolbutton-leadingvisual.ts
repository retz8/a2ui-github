import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Slot: each segment carries a `leadingVisual` Icon (eye / code / git-commit) before its label. */
export const segmentedcontrolbuttonLeadingvisualFixture: Fixture = {
  name: 'segmentedcontrolbutton-leadingvisual',
  messages: surface('segmentedcontrolbutton-leadingvisual', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      accessibility: {label: 'File view'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Preview', leadingVisual: 'i0'},
    {id: 'i0', component: 'Icon', name: 'eye'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Raw', leadingVisual: 'i1'},
    {id: 'i1', component: 'Icon', name: 'code'},
    {id: 's2', component: 'SegmentedControlButton', label: 'Blame', leadingVisual: 'i2'},
    {id: 'i2', component: 'Icon', name: 'git-commit'},
  ]),
};
