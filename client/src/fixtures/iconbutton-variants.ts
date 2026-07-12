import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const VARIANTS = ['default', 'primary', 'invisible', 'danger', 'link'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `iconbutton-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'IconButton',
            icon: 'glyph',
            variant,
            accessibility: {label: variant},
            action: {
              functionCall: {call: 'consoleLog', args: {message: variant}, returnType: 'void'},
            },
          },
          {id: 'glyph', component: 'Icon', name: 'x'},
        ],
      },
    },
  ];
}

export const iconbuttonVariantsFixture: Fixture = {
  name: 'iconbutton-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
