import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * `selectedItemIds` bound to `/selected` (initially ['docs']) — two-way write-back. Uses the
 * `multiple` variant so selection is observable through each option's `aria-selected`: the initial
 * bound value marks Docs selected, and selecting another option writes the new id array back through
 * the binder's auto-generated setter, round-trips through the bound path, and marks that option
 * selected too (render-test only).
 */
export const autocompleteSelectedBoundFixture: Fixture = {
  name: 'autocomplete-selected-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'autocomplete-selected-bound', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-selected-bound',
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
            selectedItemIds: {path: '/selected'},
            items: [
              {id: 'bug', text: 'Bug'},
              {id: 'feature', text: 'Feature'},
              {id: 'docs', text: 'Docs'},
            ],
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'autocomplete-selected-bound',
        path: '/',
        value: {selected: ['docs']},
      },
    },
  ],
};
