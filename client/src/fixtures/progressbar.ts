import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const progressbarFixture: Fixture = {
  name: 'progressbar',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'progressbar', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'progressbar',
        components: [{id: 'root', component: 'ProgressBar', progress: 65}],
      },
    },
  ],
};
