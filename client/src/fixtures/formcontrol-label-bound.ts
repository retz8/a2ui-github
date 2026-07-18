import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The family's shared DynamicString channel: FormControlLabel.text bound to /labelText.
export const formcontrolLabelBoundFixture: Fixture = {
  name: 'formcontrol-label-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'formcontrol-label-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'formcontrol-label-bound',
        components: [
          {id: 'root', component: 'FormControl', children: ['fc-label', 'fc-input']},
          {id: 'fc-label', component: 'FormControlLabel', text: {path: '/labelText'}},
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'formcontrol-label-bound',
        path: '/',
        value: {labelText: 'Repository name'},
      },
    },
  ],
};
