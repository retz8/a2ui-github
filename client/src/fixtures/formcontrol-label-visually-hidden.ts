import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Label visuallyHidden: the label is removed visually but stays in the accessibility tree; the
// input remains.
export const formcontrolLabelVisuallyHiddenFixture: Fixture = {
  name: 'formcontrol-label-visually-hidden',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'formcontrol-label-visually-hidden', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'formcontrol-label-visually-hidden',
        components: [
          {id: 'root', component: 'FormControl', children: ['fc-label', 'fc-input']},
          {
            id: 'fc-label',
            component: 'FormControlLabel',
            text: 'Repository name',
            visuallyHidden: true,
          },
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
        ],
      },
    },
  ],
};
