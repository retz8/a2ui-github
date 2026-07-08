import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonIconFixture: Fixture = {
  name: 'button-icon',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-icon', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-icon',
        components: [
          {
            id: 'root',
            component: 'Button',
            icon: 'glyph',
            accessibility: {label: 'Star'},
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'icon'}, returnType: 'void'},
            },
          },
          {id: 'glyph', component: 'Icon', name: 'star'},
        ],
      },
    },
  ],
};
