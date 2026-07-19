import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Input placeholder while empty (baselined closed-input state).
export const autocompletePlaceholderFixture: Fixture = {
  name: 'autocomplete-placeholder',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'autocomplete-placeholder', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-placeholder',
        components: [
          {id: 'root', component: 'Autocomplete', children: ['input', 'overlay']},
          {
            id: 'input',
            component: 'Autocomplete.Input',
            value: '',
            placeholder: 'Search labels',
            leadingVisual: 'search-icon',
            accessibility: {label: 'Filter labels'},
          },
          {id: 'search-icon', component: 'Icon', name: 'search'},
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
  ],
};
