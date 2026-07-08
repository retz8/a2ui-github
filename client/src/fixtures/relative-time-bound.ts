import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Bound counterpart: the datetime arrives via a path binding into the data model. Same coarse
// now−3-days offset so "3 days ago" stays stable across runs.
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

export const relativeTimeBoundFixture: Fixture = {
  name: 'relative-time-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'relative-time-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'relative-time-bound',
        components: [{id: 'root', component: 'RelativeTime', datetime: {path: '/timestamp'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'relative-time-bound',
        path: '/',
        value: {timestamp: threeDaysAgo},
      },
    },
  ],
};
