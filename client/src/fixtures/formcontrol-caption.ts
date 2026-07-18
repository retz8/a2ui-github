import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Label + helper Caption + a TextInput.
export const formcontrolCaptionFixture: Fixture = {
  name: 'formcontrol-caption',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'formcontrol-caption', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'formcontrol-caption',
        components: [
          {id: 'root', component: 'FormControl', children: ['fc-label', 'fc-caption', 'fc-input']},
          {id: 'fc-label', component: 'FormControlLabel', text: 'Repository name'},
          {
            id: 'fc-caption',
            component: 'FormControlCaption',
            text: 'Choose a unique repository name',
          },
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
        ],
      },
    },
  ],
};
