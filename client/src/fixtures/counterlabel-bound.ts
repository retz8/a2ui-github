import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const counterlabelBoundFixture: Fixture = {
  name: 'counterlabel-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'counterlabel-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'counterlabel-bound',
        components: [{id: 'root', component: 'CounterLabel', count: {path: '/notifications'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'counterlabel-bound',
        path: '/',
        value: {notifications: '42'},
      },
    },
  ],
};
