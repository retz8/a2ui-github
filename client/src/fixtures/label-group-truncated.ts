import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

/**
 * Visually-distinct state: `visibleChildCount: 3` truncates a six-`Label` group, showing three
 * items plus the `+3` overflow affordance (default `overflowStyle: overlay`). Carries the visual
 * proof of the numeric truncation arm.
 */
export const labelGroupTruncatedFixture: Fixture = {
  name: 'label-group-truncated',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'label-group-truncated', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'label-group-truncated',
        components: [
          {
            id: 'root',
            component: 'LabelGroup',
            visibleChildCount: 3,
            children: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6'],
          },
          {id: 'l1', component: 'Label', text: 'bug'},
          {id: 'l2', component: 'Label', text: 'enhancement'},
          {id: 'l3', component: 'Label', text: 'help wanted'},
          {id: 'l4', component: 'Label', text: 'question'},
          {id: 'l5', component: 'Label', text: 'documentation'},
          {id: 'l6', component: 'Label', text: 'duplicate'},
        ],
      },
    },
  ],
};
