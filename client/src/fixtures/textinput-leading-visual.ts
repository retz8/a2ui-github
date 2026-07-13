import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

export const textinputLeadingVisualFixture: Fixture = {
  name: 'textinput-leading-visual',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'textinput-leading-visual', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'textinput-leading-visual',
        components: [
          {id: 'root', component: 'TextInput', value: 'octocat', leadingVisual: 'lv'},
          {id: 'lv', component: 'Icon', name: 'search'},
        ],
      },
    },
  ],
};
