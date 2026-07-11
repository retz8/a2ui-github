import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const statelabelBoundFixture: Fixture = {
  name: 'statelabel-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'statelabel-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'statelabel-bound',
        components: [
          {id: 'root', component: 'StateLabel', text: {path: '/state'}, status: 'pullMerged'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'statelabel-bound',
        path: '/',
        value: {state: 'Merged'},
      },
    },
  ],
};
