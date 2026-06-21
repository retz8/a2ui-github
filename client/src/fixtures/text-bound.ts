import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textBoundFixture: Fixture = {
  name: 'text-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'text-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'text-bound',
        components: [{id: 'root', component: 'Text', text: {path: '/greeting'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'text-bound', path: '/', value: {greeting: 'Bound hello'}},
    },
  ],
};
