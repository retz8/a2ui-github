import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Base composed Autocomplete family (menu closed — the baselined closed-input state). Mirrors
 * Primer's nesting: root Autocomplete → [Input, Overlay → Menu]. The Input shows a literal value and
 * a search leadingVisual; the Menu carries three labelled suggestions, each with a leading Icon, and
 * an empty selection. The open-menu surface is covered by vitest render-tests (the menu opens only
 * on focus/type, which the static baseline harness can't drive).
 */
export const autocompleteFixture: Fixture = {
  name: 'autocomplete',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'autocomplete', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'autocomplete',
        components: [
          {id: 'root', component: 'Autocomplete', children: ['input', 'overlay']},
          {
            id: 'input',
            component: 'Autocomplete.Input',
            value: 'bug',
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
              {id: 'bug', text: 'Bug', leadingVisual: 'bug-icon'},
              {id: 'feature', text: 'Feature', leadingVisual: 'feature-icon'},
              {id: 'docs', text: 'Docs', leadingVisual: 'docs-icon'},
            ],
          },
          {id: 'bug-icon', component: 'Icon', name: 'bug'},
          {id: 'feature-icon', component: 'Icon', name: 'rocket'},
          {id: 'docs-icon', component: 'Icon', name: 'book'},
        ],
      },
    },
  ],
};
