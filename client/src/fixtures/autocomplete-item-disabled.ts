import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// A disabled suggestion is rendered but not selectable (render-test only).
export const autocompleteItemDisabledFixture: Fixture = {
  name: 'autocomplete-item-disabled',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'autocomplete-item-disabled', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-item-disabled',
        components: [
          {id: 'root', component: 'Autocomplete', children: ['input', 'overlay']},
          {
            id: 'input',
            component: 'Autocomplete.Input',
            value: '',
            accessibility: {label: 'Filter labels'},
          },
          {id: 'overlay', component: 'Autocomplete.Overlay', children: ['menu']},
          {
            id: 'menu',
            component: 'Autocomplete.Menu',
            accessibility: {label: 'Labels'},
            selectedItemIds: [],
            items: [
              {id: 'bug', text: 'Bug'},
              {id: 'feature', text: 'Feature', disabled: true},
              {id: 'docs', text: 'Docs'},
            ],
          },
        ],
      },
    },
  ],
};
