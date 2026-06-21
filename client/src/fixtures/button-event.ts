import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonEventFixture: Fixture = {
  name: 'button-event',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-event', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-event',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            variant: 'primary',
            disabled: {path: '/submitted'},
            action: {event: {name: 'submit', context: {}}},
          },
          {id: 'label', component: 'Text', text: 'Send event'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {surfaceId: 'button-event', path: '/', value: {submitted: false}},
    },
  ],
};
