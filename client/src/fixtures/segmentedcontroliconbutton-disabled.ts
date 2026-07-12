import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Visually-distinct state: the middle icon segment is `disabled` and cannot be selected. */
export const segmentedcontroliconbuttonDisabledFixture: Fixture = {
  name: 'segmentedcontroliconbutton-disabled',
  messages: surface('segmentedcontroliconbutton-disabled', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      accessibility: {label: 'Layout'},
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlIconButton', icon: 'i0', accessibility: {label: 'Zoom'}},
    {id: 'i0', component: 'Icon', name: 'zoom-in'},
    {
      id: 's1',
      component: 'SegmentedControlIconButton',
      icon: 'i1',
      accessibility: {label: 'List'},
      disabled: true,
    },
    {id: 'i1', component: 'Icon', name: 'list-unordered'},
    {
      id: 's2',
      component: 'SegmentedControlIconButton',
      icon: 'i2',
      accessibility: {label: 'Browser'},
    },
    {id: 'i2', component: 'Icon', name: 'browser'},
  ]),
};
