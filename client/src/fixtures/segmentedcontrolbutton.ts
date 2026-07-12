import {surface} from './stack-helpers';
import type {Fixture} from './types';

/**
 * Base fixture: the text segment renders only inside a `SegmentedControl` (the Stack.Item
 * precedent). Three segments with literal labels; the first is selected.
 */
export const segmentedcontrolbuttonFixture: Fixture = {
  name: 'segmentedcontrolbutton',
  messages: surface('segmentedcontrolbutton', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      accessibility: {label: 'File view'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Raw'},
    {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
  ]),
};
