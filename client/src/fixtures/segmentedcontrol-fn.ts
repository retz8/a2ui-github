import {surface} from './stack-helpers';
import type {Fixture} from './types';

/** Interaction (functionCall path): selecting a segment runs the registered local `consoleLog`. */
export const segmentedcontrolFnFixture: Fixture = {
  name: 'segmentedcontrol-fn',
  messages: surface('segmentedcontrol-fn', [
    {
      id: 'root',
      component: 'SegmentedControl',
      selectedIndex: 0,
      accessibility: {label: 'File view'},
      action: {
        functionCall: {call: 'consoleLog', args: {message: 'segment changed'}, returnType: 'void'},
      },
      children: ['s0', 's1', 's2'],
    },
    {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
    {id: 's1', component: 'SegmentedControlButton', label: 'Raw'},
    {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
  ]),
};
