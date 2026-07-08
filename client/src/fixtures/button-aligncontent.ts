import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const ALIGNMENTS = ['start', 'center'] as const;

function alignSurface(alignContent: (typeof ALIGNMENTS)[number]): A2uiMessage[] {
  const surfaceId = `align-${alignContent}`;
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
            alignContent,
            block: true,
            action: {
              functionCall: {call: 'consoleLog', args: {message: alignContent}, returnType: 'void'},
            },
          },
          {id: 'label', component: 'Text', text: alignContent},
        ],
      },
    },
  ];
}

export const buttonAligncontentFixture: Fixture = {
  name: 'button-aligncontent',
  messages: ALIGNMENTS.flatMap(alignSurface),
};
