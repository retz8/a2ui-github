import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonLeadingVisualFixture: Fixture = {
  name: 'button-leading-visual',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-leading-visual', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-leading-visual',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            leadingVisual: 'glyph',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'leadingVisual'},
                returnType: 'void',
              },
            },
          },
          {id: 'label', component: 'Text', text: 'Comment'},
          {id: 'glyph', component: 'Icon', name: 'comment'},
        ],
      },
    },
  ],
};
