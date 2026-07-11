import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const issuelabeltokenBoundFixture: Fixture = {
  name: 'issuelabeltoken-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'issuelabeltoken-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'issuelabeltoken-bound',
        components: [{id: 'root', component: 'IssueLabelToken', text: {path: '/labelText'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'issuelabeltoken-bound',
        path: '/',
        value: {labelText: 'Bound label'},
      },
    },
  ],
};
