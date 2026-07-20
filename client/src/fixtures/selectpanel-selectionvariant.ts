import {spSurface, spItem} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery — `selectionVariant`: `single` (checkmarks) vs `multiple` (checkboxes), each a realistic
// 4-item list with 1–2 selected.
const VARIANTS = ['single', 'multiple'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  return spSurface(
    `selectpanel-selectionvariant-${variant}`,
    {selectionVariant: variant, title: `Apply labels (${variant})`},
    ['bug', 'documentation', 'enhancement', 'ci'],
    [
      spItem('bug', 'bug', {selected: true}),
      spItem('documentation', 'documentation', variant === 'multiple' ? {selected: true} : {}),
      spItem('enhancement', 'enhancement'),
      spItem('ci', 'ci'),
    ],
  );
}

export const selectPanelSelectionvariantFixture: Fixture = {
  name: 'selectpanel-selectionvariant',
  messages: VARIANTS.flatMap(variantSurface),
};
