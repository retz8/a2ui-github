import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const GAPS = ['none', 'condensed'] as const;
const ICONS = ['bold', 'italic', 'strikethrough'] as const;

function gapSurface(gap: (typeof GAPS)[number]): A2uiMessage[] {
  const surfaceId = `action-bar-gap-${gap}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'ActionBar',
            gap,
            accessibility: {label: `Formatting (gap: ${gap})`},
            children: ICONS.map((_, i) => `b${i}`),
          },
          ...ICONS.flatMap((icon, i) => [
            {
              id: `b${i}`,
              component: 'ActionBar.IconButton',
              icon: `b${i}-icon`,
              accessibility: {label: icon},
              action: {
                functionCall: {call: 'consoleLog', args: {message: icon}, returnType: 'void'},
              },
            },
            {id: `b${i}-icon`, component: 'Icon', name: icon},
          ]),
        ],
      },
    },
  ] as A2uiMessage[];
}

/** Visual enum gallery for `gap`: one bar per `['none','condensed']`. */
export const actionBarGapFixture: Fixture = {
  name: 'action-bar-gap',
  messages: GAPS.flatMap(gapSurface),
};
