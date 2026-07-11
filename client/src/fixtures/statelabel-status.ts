import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The full status enum on a single StateLabel; each surface's text is the status value
// name, so the gallery is self-identifying and status is the only differing axis.
const STATUSES = [
  'issueOpened',
  'issueClosed',
  'issueClosedNotPlanned',
  'pullOpened',
  'pullClosed',
  'pullMerged',
  'draft',
  'issueDraft',
  'pullQueued',
  'unavailable',
  'alertOpened',
  'alertFixed',
  'alertDismissed',
  'alertClosed',
  'open',
  'closed',
  'archived',
] as const;

function statusSurface(status: (typeof STATUSES)[number]): A2uiMessage[] {
  const surfaceId = `statelabel-status-${status}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'StateLabel', text: status, status}],
      },
    },
  ];
}

export const statelabelStatusFixture: Fixture = {
  name: 'statelabel-status',
  messages: STATUSES.flatMap(statusSurface),
};
