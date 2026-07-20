import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// emptyStateText shown when the typed input matches no option (render-test only).
export const autocompleteEmptyFixture: Fixture = {
  name: 'autocomplete-empty',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'autocomplete-empty', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-empty',
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
            emptyStateText: 'No labels found',
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
