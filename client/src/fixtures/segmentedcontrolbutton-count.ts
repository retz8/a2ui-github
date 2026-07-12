import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Visually-distinct state: each segment carries a trailing `count`. */
export const segmentedcontrolbuttonCountFixture: Fixture = {
  name: 'segmentedcontrolbutton-count',
  messages: surface('segmentedcontrolbutton-count', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      accessibility: {label: 'Review state'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Open', count: '8'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Merged', count: '24'},
    {id: 's2', component: 'SegmentedControlButton', label: 'Closed', count: '3'},
  ]),
};
