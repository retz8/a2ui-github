import {CATALOG_ID} from 'primer-a2ui-adapter';
import {anchor} from './selectpanel-helpers';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery — `message.variant`: `empty` / `error` / `warning`. The list is replaced by the message
// state (`children: []`).
const VARIANTS = ['empty', 'error', 'warning'] as const;
const BODY: Record<(typeof VARIANTS)[number], {title: string; body: string}> = {
  empty: {title: 'No labels', body: 'This repository has no labels yet.'},
  error: {title: 'Could not load labels', body: 'Try again in a moment.'},
  warning: {title: 'Labels unavailable', body: 'Label sync is degraded.'},
};

function messageSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `selectpanel-message-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'SelectPanel',
            anchor: 'trigger',
            open: true,
            selectionVariant: 'multiple',
            title: 'Apply labels',
            children: [],
            message: {...BODY[variant], variant},
          },
          ...anchor(),
        ],
      },
    },
  ];
}

export const selectPanelMessageFixture: Fixture = {
  name: 'selectpanel-message',
  messages: VARIANTS.flatMap(messageSurface),
};
