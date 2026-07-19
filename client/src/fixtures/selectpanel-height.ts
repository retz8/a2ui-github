import {spSurface, spItem} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// `height` preset walk: one surface per preset, with enough items to show the fixed height.
const HEIGHTS = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
const ITEMS = ['bug', 'documentation', 'enhancement', 'ci', 'wontfix', 'duplicate', 'invalid'];

function heightSurface(height: (typeof HEIGHTS)[number]): A2uiMessage[] {
  return spSurface(
    `selectpanel-height-${height}`,
    {height, title: `Apply labels (${height})`, selectionVariant: 'multiple'},
    ITEMS,
    ITEMS.map(id => spItem(id, id)),
  );
}

export const selectPanelHeightFixture: Fixture = {
  name: 'selectpanel-height',
  messages: HEIGHTS.flatMap(heightSurface),
};
