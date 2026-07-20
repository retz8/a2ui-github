import {spSurface, spItem} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery — `SelectPanel.Item.descriptionVariant`: `inline` (beside) vs `block` (below).
const VARIANTS = ['inline', 'block'] as const;

function descSurface(descriptionVariant: (typeof VARIANTS)[number]): A2uiMessage[] {
  return spSurface(
    `selectpanel-item-description-${descriptionVariant}`,
    {selectionVariant: 'multiple', title: `Apply labels (${descriptionVariant})`},
    ['bug', 'enhancement', 'documentation'],
    [
      spItem('bug', 'bug', {description: "Something isn't working", descriptionVariant}),
      spItem('enhancement', 'enhancement', {
        description: 'New feature or request',
        descriptionVariant,
      }),
      spItem('documentation', 'documentation', {
        description: 'Improvements or additions to docs',
        descriptionVariant,
      }),
    ],
  );
}

export const selectPanelItemDescriptionFixture: Fixture = {
  name: 'selectpanel-item-description',
  messages: VARIANTS.flatMap(descSurface),
};
