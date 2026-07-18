import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The complete stack together: Label + Caption + Validation(error) + a TextInput.
export const formcontrolFullFixture: Fixture = {
  name: 'formcontrol-full',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'formcontrol-full', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'formcontrol-full',
        components: [
          {
            id: 'root',
            component: 'FormControl',
            children: ['fc-label', 'fc-caption', 'fc-input', 'fc-validation'],
          },
          {id: 'fc-label', component: 'FormControlLabel', text: 'Repository name'},
          {
            id: 'fc-caption',
            component: 'FormControlCaption',
            text: 'Choose a unique repository name',
          },
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
          {
            id: 'fc-validation',
            component: 'FormControlValidation',
            variant: 'error',
            text: 'That name is already taken',
          },
        ],
      },
    },
  ],
};
