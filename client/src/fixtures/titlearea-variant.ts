import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import {surface} from './stack-helpers';
import type {Fixture} from './types';

// The variant enum on a TitleArea; each surface holds a PageHeader root wrapping a TitleArea at
// that variant, whose Title child's text is the variant name. The PageHeader root is required:
// Primer applies the variant's title font-size to the root via a `:has()` selector, so a bare
// TitleArea renders every variant at the inherited size with no visual differentiation.
const VARIANTS = ['subtitle', 'medium', 'large'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  return surface(`titlearea-variant-${variant}`, [
    {id: 'root', component: 'PageHeader', children: ['titlearea']},
    {id: 'titlearea', component: 'PageHeader.TitleArea', variant, children: ['title']},
    {id: 'title', component: 'PageHeader.Title', text: variant},
  ]);
}

export const titleareaVariantFixture: Fixture = {
  name: 'titlearea-variant',
  messages: VARIANTS.flatMap(variantSurface),
};
