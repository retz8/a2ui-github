import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Interaction (event path) + agent coupling + bound `selectedIndex` (the two-way-binding proof).
 * `selectedIndex` is a controlled binding to `/view` (initial 0, Preview active). Clicking Blame
 * (index 2) first writes `/view = 2` optimistically (so the event's `context.selectedIndex` carries
 * the new index), then fires `change`. The deterministic agent confirms `/view = 2` and swaps the
 * `status` Text; the `/view` write is visible through the `selectedIndex <- /view` coupling — the
 * rendered selection follows the data model.
 *
 * The surface root (id `root`) is a `Stack` hosting `[control, status]`. The `status` Text is the
 * agent's self-visible surface (swapped by the `change` response's updateComponents).
 */
export const segmentedcontrolEventFixture: Fixture = {
  name: 'segmentedcontrol-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'segmentedcontrol-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'segmentedcontrol-event',
        components: [
          {id: 'root', component: 'Stack', align: 'start', children: ['control', 'status']},
          {
            id: 'control',
            component: 'SegmentedControl',
            selectedIndex: {path: '/view'},
            accessibility: {label: 'File view'},
            action: {event: {name: 'change', context: {selectedIndex: {path: '/view'}}}},
            children: ['s0', 's1', 's2'],
          },
          {id: 's0', component: 'SegmentedControlButton', label: 'Preview'},
          {id: 's1', component: 'SegmentedControlButton', label: 'Raw'},
          {id: 's2', component: 'SegmentedControlButton', label: 'Blame'},
          {id: 'status', component: 'Text', text: 'Pick a view'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'segmentedcontrol-event', path: '/', value: {view: 0}},
    },
  ],
};
