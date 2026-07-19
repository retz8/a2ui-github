import {spSurface, spItem} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// `width` preset walk: one surface per preset.
const WIDTHS = ['small', 'medium', 'large', 'xlarge', 'xxlarge'] as const;

function widthSurface(width: (typeof WIDTHS)[number]): A2uiMessage[] {
  return spSurface(
    `selectpanel-width-${width}`,
    {width, title: `Apply labels (${width})`, selectionVariant: 'multiple'},
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
  );
}

export const selectPanelWidthFixture: Fixture = {
  name: 'selectpanel-width',
  messages: WIDTHS.flatMap(widthSurface),
};
