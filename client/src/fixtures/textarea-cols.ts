import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaColsFixture: Fixture = {
  name: 'textarea-cols',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-cols', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-cols',
        components: [{id: 'root', component: 'Textarea', value: 'Sixty columns wide', cols: 60}],
      },
    },
  ],
};
