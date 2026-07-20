import {spSurface, spItem} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery — `SelectPanel.Item.variant`: `default` vs `danger` (destructive choice).
const VARIANTS = ['default', 'danger'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  return spSurface(
    `selectpanel-item-variant-${variant}`,
    {selectionVariant: 'multiple', title: `Apply labels (${variant})`},
    ['bug', 'wontfix', 'documentation'],
    [
      spItem('bug', 'bug', {variant}),
      spItem('wontfix', 'wontfix', {variant}),
      spItem('documentation', 'documentation', {variant}),
    ],
  );
}

export const selectPanelItemVariantFixture: Fixture = {
  name: 'selectpanel-item-variant',
  messages: VARIANTS.flatMap(variantSurface),
};
