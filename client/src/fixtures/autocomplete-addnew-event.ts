import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * `addNewItem.action` on the event path — the family's one agent round-trip. The user typed a value
 * not among the suggestions (`/query = "wontfix"`) and chooses "Create new label", firing the
 * `create-label` event. The deterministic agent creates the label, writes a confirmation to
 * `/add/message` (visible through the bound `add-message` Text), selects the newly created value by
 * writing `/selected = ['wontfix']` (proving the two-way `selectedItemIds` binding), and swaps
 * `add-status` (see agent/deterministic_agent/fixtures/create-label.json). The typed value is read
 * from `/query`, not the event context (authored-context `addNewItem` limitation).
 */
export const autocompleteAddnewEventFixture: Fixture = {
  name: 'autocomplete-addnew-event',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'autocomplete-addnew-event', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-addnew-event',
        components: [
          {
            id: 'root',
            component: 'Stack',
            align: 'start',
            children: ['ac', 'add-message', 'add-status'],
          },
          {id: 'ac', component: 'Autocomplete', children: ['input', 'overlay']},
          {
            id: 'input',
            component: 'Autocomplete.Input',
            value: {path: '/query'},
            accessibility: {label: 'Filter labels'},
          },
          {id: 'overlay', component: 'Autocomplete.Overlay', children: ['menu']},
          {
            id: 'menu',
            component: 'Autocomplete.Menu',
            accessibility: {label: 'Labels'},
            selectedItemIds: {path: '/selected'},
            items: [
              {id: 'bug', text: 'Bug'},
              {id: 'feature', text: 'Feature'},
              {id: 'docs', text: 'Docs'},
            ],
            addNewItem: {
              id: 'add-new',
              text: 'Create new label',
              action: {event: {name: 'create-label', context: {}}},
            },
          },
          {id: 'add-message', component: 'Text', text: {path: '/add/message'}},
          {id: 'add-status', component: 'Text', text: '—'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'autocomplete-addnew-event',
        path: '/',
        value: {query: 'wontfix', selected: [], add: {message: 'No label yet'}},
      },
    },
  ],
};
