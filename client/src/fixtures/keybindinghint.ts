import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const keybindinghintFixture: Fixture = {
  name: 'keybindinghint',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'keybindinghint', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'keybindinghint',
        components: [{id: 'root', component: 'KeybindingHint', keys: 'Mod+k'}],
      },
    },
  ],
};
