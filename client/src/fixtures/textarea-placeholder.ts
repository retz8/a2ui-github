import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaPlaceholderFixture: Fixture = {
  name: 'textarea-placeholder',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-placeholder', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-placeholder',
        components: [
          {id: 'root', component: 'Textarea', value: '', placeholder: 'Leave a comment'},
        ],
      },
    },
  ],
};
