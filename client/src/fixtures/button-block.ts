import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonBlockFixture: Fixture = {
  name: 'button-block',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-block', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-block',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            block: true,
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'block'}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: 'Full width'},
        ],
      },
    },
  ],
};
