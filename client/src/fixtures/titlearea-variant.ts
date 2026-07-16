import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The variant enum on a TitleArea; each surface holds a Title child whose text is the variant name.
const VARIANTS = ['subtitle', 'medium', 'large'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `titlearea-variant-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'PageHeader.TitleArea', variant, children: ['title']},
          {id: 'title', component: 'PageHeader.Title', text: variant},
        ],
      },
    },
  ];
}

export const titleareaVariantFixture: Fixture = {
  name: 'titlearea-variant',
  messages: VARIANTS.flatMap(variantSurface),
};
