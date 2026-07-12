import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const keybindinghintBoundFixture: Fixture = {
  name: 'keybindinghint-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'keybindinghint-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'keybindinghint-bound',
        components: [{id: 'root', component: 'KeybindingHint', keys: {path: '/keys'}}],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'keybindinghint-bound',
        path: '/',
        value: {keys: 'Control+Shift+p'},
      },
    },
  ],
};
