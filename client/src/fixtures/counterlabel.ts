import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const counterlabelFixture: Fixture = {
  name: 'counterlabel',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'counterlabel', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'counterlabel',
        components: [{id: 'root', component: 'CounterLabel', count: '12'}],
      },
    },
  ],
};
