import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Menu loading indicator (loading: true) while options are fetched (render-test only).
export const autocompleteLoadingFixture: Fixture = {
  name: 'autocomplete-loading',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'autocomplete-loading', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-loading',
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
            loading: true,
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
