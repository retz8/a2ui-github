import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Two-way bound value: user edits write back to /draft via the binder's auto-generated setter.
export const textareaBoundFixture: Fixture = {
  name: 'textarea-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-bound',
        components: [{id: 'root', component: 'Textarea', value: {path: '/draft'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'textarea-bound',
        path: '/',
        value: {draft: 'A multiline\ncomment draft.'},
      },
    },
  ],
};
