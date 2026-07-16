import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Eight toolbar buttons in a fixed narrow container: more than fit, so the surplus collapse into
// Primer's automatic "…" overflow menu (measured behavior — emergent, not a carried prop).
const ICONS = [
  'bold',
  'italic',
  'strikethrough',
  'typography',
  'list-unordered',
  'code',
  'link-external',
  'quote',
] as const;

/**
 * Signature behavior: automatic overflow. The bar is placed in a ~120px-wide container so most
 * buttons don't fit and Primer collapses them into an overflow menu. (The container width lives in
 * the fixture host / Playwright viewport; the fixture itself just supplies enough buttons.)
 */
export const actionBarOverflowFixture: Fixture = {
  name: 'action-bar-overflow',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'action-bar-overflow', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'action-bar-overflow',
        components: [
          {
            id: 'root',
            component: 'ActionBar',
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
