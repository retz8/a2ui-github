import {spSurface, spItem} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery — `notice.variant`: `info` / `warning` / `error`, each the base list plus a top banner.
const VARIANTS = ['info', 'warning', 'error'] as const;

function noticeSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  return spSurface(
    `selectpanel-notice-${variant}`,
    {
      selectionVariant: 'multiple',
      title: 'Apply labels',
      notice: {text: 'Some labels are managed by policy', variant},
    },
    ['bug', 'documentation', 'enhancement'],
    [
      spItem('bug', 'bug'),
      spItem('documentation', 'documentation'),
      spItem('enhancement', 'enhancement'),
    ],
  );
}

export const selectPanelNoticeFixture: Fixture = {
  name: 'selectpanel-notice',
  messages: VARIANTS.flatMap(noticeSurface),
};
