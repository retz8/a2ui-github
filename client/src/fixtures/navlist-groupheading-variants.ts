import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The GroupHeading `variant` enum, one NavList group per value.
const VARIANTS = ['subtle', 'filled'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `navlist-groupheading-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'NavList', 'aria-label': 'Repository', children: ['grp']},
          {id: 'grp', component: 'NavList.Group', children: ['heading', 'a', 'b']},
          {id: 'heading', component: 'NavList.GroupHeading', text: variant, variant},
          {id: 'a', component: 'NavList.Item', href: '#/a', children: ['a-label']},
          {id: 'a-label', component: 'Text', text: 'Item A'},
          {id: 'b', component: 'NavList.Item', href: '#/b', children: ['b-label']},
          {id: 'b-label', component: 'Text', text: 'Item B'},
        ],
      },
    },
  ];
}

export const navlistGroupheadingVariantsFixture: Fixture = {
  name: 'navlist-groupheading-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
