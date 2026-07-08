import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonInactiveFixture: Fixture = {
  name: 'button-inactive',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-inactive', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-inactive',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            inactive: true,
            action: {event: {name: 'noop', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Inactive'},
        ],
      },
    },
  ],
};
