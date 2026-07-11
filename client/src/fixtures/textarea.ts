import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaFixture: Fixture = {
  name: 'textarea',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea',
        components: [{id: 'root', component: 'Textarea', value: 'A multiline\ncomment draft.'}],
      },
    },
  ],
};
