import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Baseline assembly: a FormControl wrapping a Label and a TextInput; layout default (vertical).
export const formcontrolFixture: Fixture = {
  name: 'formcontrol',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'formcontrol', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'formcontrol',
        components: [
          {id: 'root', component: 'FormControl', children: ['fc-label', 'fc-input']},
          {id: 'fc-label', component: 'FormControlLabel', text: 'Repository name'},
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
        ],
      },
    },
  ],
};
