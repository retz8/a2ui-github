import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// A `danger`-variant suggestion renders with destructive styling (render-test only).
export const autocompleteItemVariantFixture: Fixture = {
  name: 'autocomplete-item-variant',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'autocomplete-item-variant', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-item-variant',
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
              {id: 'wontfix', text: 'Wontfix', variant: 'danger'},
            ],
          },
        ],
      },
    },
  ],
};
