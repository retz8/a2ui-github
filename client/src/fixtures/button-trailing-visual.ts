import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonTrailingVisualFixture: Fixture = {
  name: 'button-trailing-visual',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-trailing-visual', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-trailing-visual',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            trailingVisual: 'glyph',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'trailingVisual'},
                returnType: 'void',
              },
            },
          },
          {id: 'label', component: 'Text', text: 'Next'},
          {id: 'glyph', component: 'Icon', name: 'chevron-right'},
        ],
      },
    },
  ],
};
