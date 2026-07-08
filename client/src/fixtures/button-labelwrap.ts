import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const buttonLabelwrapFixture: Fixture = {
  name: 'button-labelwrap',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'button-labelwrap', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'button-labelwrap',
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            labelWrap: true,
            action: {
              functionCall: {call: 'consoleLog', args: {message: 'labelWrap'}, returnType: 'void'},
            },
          },
          {
            id: 'label',
            component: 'Text',
            text: 'This is a very long button label that should wrap onto multiple lines',
          },
        ],
      },
    },
  ],
};
