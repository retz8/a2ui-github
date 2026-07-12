import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Base fixture: a static ChildList (array of ids) in a default LabelGroup (`overflowStyle:
 * overlay`, no truncation). The four children are `Label` leaves — the idiomatic content for a
 * label group.
 */
export const labelGroupFixture: Fixture = {
  name: 'label-group',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'label-group', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'label-group',
        components: [
          {id: 'root', component: 'LabelGroup', children: ['l1', 'l2', 'l3', 'l4']},
          {id: 'l1', component: 'Label', text: 'bug'},
          {id: 'l2', component: 'Label', text: 'enhancement'},
          {id: 'l3', component: 'Label', text: 'help wanted'},
          {id: 'l4', component: 'Label', text: 'question'},
        ],
      },
    },
  ],
};
