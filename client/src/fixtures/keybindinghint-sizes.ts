import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// The size enum on a single KeybindingHint; each surface pins the same chord so size is
// the only differing axis.
const SIZES = ['small', 'normal'] as const;

function sizeSurface(size: (typeof SIZES)[number]): A2uiMessage[] {
  const surfaceId = `keybindinghint-sizes-${size}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [{id: 'root', component: 'KeybindingHint', keys: 'Mod+k', size}],
      },
    },
  ];
}

export const keybindinghintSizesFixture: Fixture = {
  name: 'keybindinghint-sizes',
  messages: SIZES.flatMap(sizeSurface),
};
