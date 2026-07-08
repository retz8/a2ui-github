import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonCountFixture: Fixture = {
  name: 'button-count',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-count', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-count',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            count: '42',
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'count'}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: 'Watch'},
        ],
      },
    },
  ],
};
