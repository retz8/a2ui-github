import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const VARIANTS = ['normal', 'spacious'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `breadcrumbs-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'Breadcrumbs', variant, children: ['c0', 'c1', 'c2']},
          {id: 'c0', component: 'BreadcrumbsItem', label: 'Home', href: '/'},
          {id: 'c1', component: 'BreadcrumbsItem', label: 'Repositories', href: '/repos'},
          {
            id: 'c2',
            component: 'BreadcrumbsItem',
            label: 'Settings',
            href: '/settings',
            selected: true,
          },
        ],
      },
    },
  ];
}

/** Visual enum: one surface per `variant` value, a 3-crumb trail each. */
export const breadcrumbsVariantFixture: Fixture = {
  name: 'breadcrumbs-variant',
  messages: VARIANTS.flatMap(variantSurface),
};
