import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The variant enum on a single KeybindingHint. onEmphasis/onPrimary are designed for
// colored backgrounds; the harness renders on the default surface, so those rows read
// low-contrast in the baseline — the gallery is the deterministic pixel record of each value.
const VARIANTS = ['normal', 'onEmphasis', 'onPrimary'] as const;

function variantSurface(variant: (typeof VARIANTS)[number]): A2uiMessage[] {
  const surfaceId = `keybindinghint-variants-${variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'KeybindingHint', keys: 'Mod+k', variant}],
      },
    },
  ];
}

export const keybindinghintVariantsFixture: Fixture = {
  name: 'keybindinghint-variants',
  messages: VARIANTS.flatMap(variantSurface),
};
