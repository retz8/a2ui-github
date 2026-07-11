import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const progressbarBoundFixture: Fixture = {
  name: 'progressbar-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'progressbar-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'progressbar-bound',
        components: [{id: 'root', component: 'ProgressBar', progress: {path: '/completion'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'progressbar-bound',
        path: '/',
        value: {completion: 40},
      },
    },
  ],
};
