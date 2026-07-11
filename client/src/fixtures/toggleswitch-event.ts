import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Event path coupled to a bound `checked` (the agent-visibility coupling). The user's flip is
 * a local, instant two-way write to `/setting`; the `toggle` event carries the new value in
 * its context. The deterministic server answers by writing `/setting` back to `false` and
 * swapping the `status` Text — proving the server stays authoritative over the two-way-bound
 * path (see agent/deterministic_agent/fixtures/toggle.json).
 */
export const toggleswitchEventFixture: Fixture = {
  name: 'toggleswitch-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'toggleswitch-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'toggleswitch-event',
        components: [
          {
            id: 'root',
            component: 'ToggleSwitch',
            checked: {path: '/setting'},
            accessibility: {label: 'Notifications'},
            action: {event: {name: 'toggle', context: {checked: {path: '/setting'}}}},
          },
          {id: 'status', component: 'Text', text: 'Flip to save setting'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'toggleswitch-event', path: '/', value: {setting: false}},
    },
  ],
};
