import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaRowsFixture: Fixture = {
  name: 'textarea-rows',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-rows', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-rows',
        components: [{id: 'root', component: 'Textarea', value: 'Three rows tall', rows: 3}],
      },
    },
  ],
};
