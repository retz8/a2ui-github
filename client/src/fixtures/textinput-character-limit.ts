import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Mini-gallery: characterLimit counter × over-limit. The over-limit state only exists as a
// characterLimit × value combination, so the two surfaces are a semantically-coupled gallery.
const withinLimitSurface: A2uiMessage[] = [
  {
    version: 'v0.9',
    createSurface: {surfaceId: 'textinput-character-limit-within', catalogId: CATALOG_ID},
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'textinput-character-limit-within',
      components: [{id: 'root', component: 'TextInput', value: 'octocat', characterLimit: 20}],
    },
  },
];

const overLimitSurface: A2uiMessage[] = [
  {
    version: 'v0.9',
    createSurface: {surfaceId: 'textinput-character-limit-over', catalogId: CATALOG_ID},
  },
  {
    version: 'v0.9',
    updateComponents: {
      surfaceId: 'textinput-character-limit-over',
      components: [{id: 'root', component: 'TextInput', value: 'octocat-labs', characterLimit: 5}],
    },
  },
];

export const textinputCharacterLimitFixture: Fixture = {
  name: 'textinput-character-limit',
  messages: [...withinLimitSurface, ...overLimitSurface],
};
