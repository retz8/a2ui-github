import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// selectionVariant 'multiple' — selection accumulates and the menu stays open (render-test only).
export const autocompleteMultipleSelectFixture: Fixture = {
  name: 'autocomplete-multiple-select',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'autocomplete-multiple-select', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-multiple-select',
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
            selectionVariant: 'multiple',
            selectedItemIds: [],
            items: [
              {id: 'bug', text: 'Bug'},
              {id: 'feature', text: 'Feature'},
              {id: 'docs', text: 'Docs'},
            ],
          },
        ],
      },
    },
  ],
};
