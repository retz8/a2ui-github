import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Two-way bound value: user edits write back to /query via the binder's auto-generated setter.
export const textinputBoundFixture: Fixture = {
  name: 'textinput-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textinput-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-bound',
        components: [{id: 'root', component: 'TextInput', value: {path: '/query'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'textinput-bound', path: '/', value: {query: 'octocat'}},
    },
  ],
};
