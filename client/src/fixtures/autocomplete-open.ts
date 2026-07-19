import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * The open-menu surface (render-test only — not baselined). Focusing/typing in the Input opens the
 * Menu; the three suggestions render with leading Icons and one carries a trailing Icon. Also drives
 * the default-filter and single-select render-tests.
 */
export const autocompleteOpenFixture: Fixture = {
  name: 'autocomplete-open',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'autocomplete-open', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete-open',
        components: [
          {id: 'root', component: 'Autocomplete', children: ['input', 'overlay']},
          {
            id: 'input',
            component: 'Autocomplete.Input',
            value: '',
            leadingVisual: 'search-icon',
            accessibility: {label: 'Filter labels'},
          },
          {id: 'search-icon', component: 'Icon', name: 'search'},
          {id: 'overlay', component: 'Autocomplete.Overlay', children: ['menu']},
          {
            id: 'menu',
            component: 'Autocomplete.Menu',
            accessibility: {label: 'Labels'},
            selectedItemIds: [],
            items: [
              {id: 'bug', text: 'Bug', leadingVisual: 'bug-icon', trailingVisual: 'tag-icon'},
              {id: 'feature', text: 'Feature', leadingVisual: 'feature-icon'},
              {id: 'docs', text: 'Docs', leadingVisual: 'docs-icon'},
            ],
          },
          {id: 'bug-icon', component: 'Icon', name: 'bug'},
          {id: 'tag-icon', component: 'Icon', name: 'tag'},
          {id: 'feature-icon', component: 'Icon', name: 'rocket'},
          {id: 'docs-icon', component: 'Icon', name: 'book'},
        ],
      },
    },
  ],
};
