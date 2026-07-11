import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Path-binding proof for srText (Spinner's only Dynamic* prop): the assistive-technology
// label resolves from the data model through the full renderer. Not baselined — srText is
// visually hidden, so this fixture is visually identical to the default spinner.
export const spinnerBoundFixture: Fixture = {
  name: 'spinner-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'spinner-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'spinner-bound',
        components: [{id: 'root', component: 'Spinner', srText: {path: '/status'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'spinner-bound',
        path: '/',
        value: {status: 'Loading pull requests'},
      },
    },
  ],
};
