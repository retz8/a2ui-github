import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Input `value` bound to `/query` (initially 'bug') — two-way write-back. Typing writes the query
 * back to the data-model path the agent reads for remote filtering / `addNewItem` (render-test
 * only).
 */
export const autocompleteValueBoundFixture: Fixture = {
  name: 'autocomplete-value-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'autocomplete-value-bound', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-value-bound',
        components: [
          {id: 'root', component: 'Autocomplete', children: ['input', 'overlay']},
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
      updateDataModel: {surfaceId: 'autocomplete-value-bound', path: '/', value: {query: 'bug'}},
    },
  ],
};
