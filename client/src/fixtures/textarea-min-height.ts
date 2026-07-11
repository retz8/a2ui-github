import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaMinHeightFixture: Fixture = {
  name: 'textarea-min-height',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-min-height', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-min-height',
        components: [{id: 'root', component: 'Textarea', value: 'Tall minimum', minHeight: 200}],
      },
    },
  ],
};
