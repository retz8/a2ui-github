import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The format enum on a single KeybindingHint; each surface uses a modifier-heavy chord so
// the condensed (symbols) and full (spelled-out) forms visibly diverge.
const FORMATS = ['condensed', 'full'] as const;

function formatSurface(format: (typeof FORMATS)[number]): A2uiMessage[] {
  const surfaceId = `keybindinghint-formats-${format}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'KeybindingHint', keys: 'Mod+Shift+k', format}],
      },
    },
  ];
}

export const keybindinghintFormatsFixture: Fixture = {
  name: 'keybindinghint-formats',
  messages: FORMATS.flatMap(formatSurface),
};
