import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const VARIANTS = ['inset', 'flush'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `underline-nav-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'UnderlineNav',
            'aria-label': 'Repository',
            variant,
            children: ['t1', 't2', 't3'],
          },
          {
            id: 't1',
            component: 'UnderlineNav.Item',
            text: 'Code',
            href: '#/code',
            'aria-current': 'page',
          },
          {id: 't2', component: 'UnderlineNav.Item', text: 'Issues', href: '#/issues'},
          {id: 't3', component: 'UnderlineNav.Item', text: 'Pull requests', href: '#/pulls'},
        ],
      },
    },
  ];
}

/** Visual enum: one surface per `variant` value, a 3-tab nav each. */
export const underlineNavVariantFixture: Fixture = {
  name: 'underline-nav-variant',
  messages: VARIANTS.flatMap(variantSurface),
};
