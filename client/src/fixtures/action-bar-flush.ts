import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

const ICONS = ['bold', 'italic', 'strikethrough'] as const;

/** Visual state for `flush: true` — the toolbar sits flush with its container's edge (no outer
 * padding). */
export const actionBarFlushFixture: Fixture = {
  name: 'action-bar-flush',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'action-bar-flush', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-flush',
        components: [
          {
            id: 'root',
            component: 'ActionBar',
            flush: true,
            accessibility: {label: 'Formatting'},
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
  ] as A2uiMessage[],
};
