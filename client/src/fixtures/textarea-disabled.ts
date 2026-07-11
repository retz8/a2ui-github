import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaDisabledFixture: Fixture = {
  name: 'textarea-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-disabled',
        components: [
          {id: 'root', component: 'Textarea', value: 'Cannot edit this', disabled: true},
        ],
      },
    },
  ],
};
