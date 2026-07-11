import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textareaContrastFixture: Fixture = {
  name: 'textarea-contrast',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'textarea-contrast', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textarea-contrast',
        components: [{id: 'root', component: 'Textarea', value: 'High contrast', contrast: true}],
      },
    },
  ],
};
