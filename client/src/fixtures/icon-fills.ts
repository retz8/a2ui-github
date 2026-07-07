import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The semantic fill-role enum on a single icon; size left at its default.
const FILLS = [
  'default',
  'muted',
  'accent',
  'success',
  'attention',
  'severe',
  'danger',
  'open',
  'closed',
  'done',
] as const;

function fillSurface(fill: (typeof FILLS)[number]): A2uiMessage[] {
  const surfaceId = `icon-fill-${fill}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'Icon', name: 'heart-fill', fill, accessibility: {label: fill}},
        ],
      },
    },
  ];
}

export const iconFillsFixture: Fixture = {
  name: 'icon-fills',
  messages: FILLS.flatMap(fillSurface),
};
