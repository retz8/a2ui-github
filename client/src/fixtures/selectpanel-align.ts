import {spSurface, spItem} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery — `align` (non-default): `center` / `end`.
const ALIGNS = ['center', 'end'] as const;

function alignSurface(align: (typeof ALIGNS)[number]): A2uiMessage[] {
  return spSurface(
    `selectpanel-align-${align}`,
    {align, title: `Apply labels (${align})`, selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
  );
}

export const selectPanelAlignFixture: Fixture = {
  name: 'selectpanel-align',
  messages: ALIGNS.flatMap(alignSurface),
};
