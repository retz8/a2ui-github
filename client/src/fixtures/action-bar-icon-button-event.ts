import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Interaction — event path, coupled to a bound `disabled` (the agent-visibility coupling). The
 * `save` event asks the deterministic server to record the save; it answers by writing
 * `/saved = true` and swapping the icon to a checkmark (see
 * agent/deterministic_agent/fixtures/save.json). The `/saved` write is visible through the
 * `disabled <- /saved` binding — after saving the button locks (preventing re-submit) and shows a
 * check, proving two-way binding on the button itself; the icon swap is self-visible.
 */
export const actionBarIconButtonEventFixture: Fixture = {
  name: 'action-bar-icon-button-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'action-bar-icon-button-event', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-icon-button-event',
        components: [
          {
            id: 'root',
            component: 'ActionBar.IconButton',
            icon: 'save-icon',
            accessibility: {label: 'Save'},
            disabled: {path: '/saved'},
            action: {event: {name: 'save', context: {}}},
          },
          {id: 'save-icon', component: 'Icon', name: 'download'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'action-bar-icon-button-event',
        path: '/',
        value: {saved: false},
      },
    },
  ],
};
