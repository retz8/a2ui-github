import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The full bg color-role enum on a single-bar ProgressBar; each surface pins progress to 65
// so color is the only differing axis.
const BG_ROLES = [
  'success',
  'attention',
  'severe',
  'danger',
  'accent',
  'done',
  'open',
  'closed',
  'draft',
  'neutral',
  'sponsors',
  'upsell',
] as const;

function bgSurface(bg: (typeof BG_ROLES)[number]): A2uiMessage[] {
  const surfaceId = `progressbar-bg-${bg}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {id: 'root', component: 'ProgressBar', progress: 65, bg, accessibility: {label: bg}},
        ],
      },
    },
  ];
}

export const progressbarBgFixture: Fixture = {
  name: 'progressbar-bg',
  messages: BG_ROLES.flatMap(bgSurface),
};
