import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaBlockFixture: Fixture = {
  name: 'textarea-block',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-block', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-block',
        components: [{id: 'root', component: 'Textarea', value: 'Full width', block: true}],
      },
    },
  ],
};
