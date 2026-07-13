import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Path binding + two-way write-back: `open` is bound to `/expanded` (initially false). Toggling
 * the summary writes the new state back through the binder's auto-generated setter, and the
 * disclosure re-renders expanded. Behavior is proven in the render/interaction tests; not visually
 * baselined (pixels match the `details-open` gallery states).
 */
export const detailsBoundFixture: Fixture = {
  name: 'details-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'details-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'details-bound',
        components: [
          {
            id: 'root',
            component: 'Details',
            summary: 'sum',
            children: ['b1'],
            open: {path: '/expanded'},
          },
          {id: 'sum', component: 'Text', text: 'More info'},
          {id: 'b1', component: 'Text', text: 'First'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'details-bound', path: '/', value: {expanded: false}},
    },
  ],
};
