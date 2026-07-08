import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const headingBoundFixture: Fixture = {
  name: 'heading-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'heading-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'heading-bound',
        components: [{id: 'root', component: 'Heading', text: {path: '/title'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'heading-bound', path: '/', value: {title: 'Bound heading'}},
    },
  ],
};
