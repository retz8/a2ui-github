import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonDisabledFixture: Fixture = {
  name: 'button-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-disabled',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            disabled: true,
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Disabled'},
        ],
      },
    },
  ],
};
