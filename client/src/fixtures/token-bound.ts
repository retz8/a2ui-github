import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const tokenBoundFixture: Fixture = {
  name: 'token-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'token-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'token-bound',
        components: [{id: 'root', component: 'Token', text: {path: '/tokenText'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'token-bound', path: '/', value: {tokenText: 'Bound token'}},
    },
  ],
};
