import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const labelBoundFixture: Fixture = {
  name: 'label-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'label-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'label-bound',
        components: [{id: 'root', component: 'Label', text: {path: '/status'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'label-bound', path: '/', value: {status: 'Bound label'}},
    },
  ],
};
