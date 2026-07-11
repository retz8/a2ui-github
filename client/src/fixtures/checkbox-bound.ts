import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Path binding + two-way write-back: `checked` is bound to `/notify` (initially false). A user
 * click writes `true` back through the binder's auto-generated setter, and the box re-renders
 * checked. Behavior is proven in the render/interaction tests; not visually baselined (pixels
 * are identical to `checkbox`).
 */
export const checkboxBoundFixture: Fixture = {
  name: 'checkbox-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-bound',
        components: [
          {
            id: 'root',
            component: 'Checkbox',
            checked: {path: '/notify'},
            accessibility: {label: 'Notify me about updates'},
          },
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'checkbox-bound', path: '/', value: {notify: false}},
    },
  ],
};
