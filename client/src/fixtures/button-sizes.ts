import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const SIZES = ['small', 'medium', 'large'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `size-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'Button',
            child: 'label',
            size,
            action: {functionCall: {call: 'consoleLog', args: {message: size}, returnType: 'void'}},
          },
          {id: 'label', component: 'Text', text: size},
        ],
      },
    },
  ];
}

export const buttonSizesFixture: Fixture = {
  name: 'button-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
