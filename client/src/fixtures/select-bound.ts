import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Path binding + two-way write-back: `value` is bound to `/selected` (initially `bug`). Choosing
 * a different option writes the new value back through the binder's auto-generated setter, and the
 * control re-renders with the new selection. Behavior is proven in the interaction test; not
 * visually baselined (pixels are identical to `select`).
 */
export const selectBoundFixture: Fixture = {
  name: 'select-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'select-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'select-bound',
        components: [
          {
            id: 'root',
            component: 'Select',
            value: {path: '/selected'},
            children: ['o1', 'o2', 'o3'],
            accessibility: {label: 'Label'},
          },
          {id: 'o1', component: 'SelectOption', text: 'Bug', value: 'bug'},
          {id: 'o2', component: 'SelectOption', text: 'Feature', value: 'feature'},
          {id: 'o3', component: 'SelectOption', text: 'Docs', value: 'docs'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'select-bound', path: '/', value: {selected: 'bug'}},
    },
  ],
};
