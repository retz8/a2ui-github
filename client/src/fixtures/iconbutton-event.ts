import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Event path coupled to a bound `disabled` (the agent-visibility coupling). The `approve` event
 * asks the deterministic server to record approval; it answers by writing `/approved = true` and
 * swapping the icon (`check` -> `check-circle-fill`, see
 * agent/deterministic_agent/fixtures/approve.json). The `/approved` write is visible through the
 * `disabled <- /approved` binding — after `approve` the button locks, proving two-way binding on
 * the button itself; the icon swap is self-visible.
 */
export const iconbuttonEventFixture: Fixture = {
  name: 'iconbutton-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'iconbutton-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'iconbutton-event',
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'approve-icon',
            accessibility: {label: 'Approve'},
            disabled: {path: '/approved'},
            action: {event: {name: 'approve', context: {}}},
          },
          {id: 'approve-icon', component: 'Icon', name: 'check'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'iconbutton-event', path: '/', value: {approved: false}},
    },
  ],
};
