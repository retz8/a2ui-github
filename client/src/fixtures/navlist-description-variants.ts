import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The Description `variant` enum, one NavList item per value.
const VARIANTS = ['inline', 'block'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `navlist-description-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['it']},
          {id: 'it', component: 'NavList.Item', href: '#', children: ['it-label', 'it-desc']},
          {id: 'it-label', component: 'Text', text: 'Notifications'},
          {id: 'it-desc', component: 'NavList.Description', text: variant, variant},
        ],
      },
    },
  ];
}

export const navlistDescriptionVariantsFixture: Fixture = {
  name: 'navlist-description-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
