import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const iconbuttonFnFixture: Fixture = {
  name: 'iconbutton-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'iconbutton-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'iconbutton-fn',
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'glyph',
            accessibility: {label: 'Like'},
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'iconbutton-fn clicked'},
                returnType: 'void',
              },
            },
          },
          {id: 'glyph', component: 'Icon', name: 'heart'},
        ],
      },
    },
  ],
};
