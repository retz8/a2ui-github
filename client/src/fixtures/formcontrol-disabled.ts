import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Root `disabled` dims the control: it cascades to the wrapped input via the FormControl-forwarded
// props (useFormControlInputProps), so the input is not marked disabled on its own.
export const formcontrolDisabledFixture: Fixture = {
  name: 'formcontrol-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'formcontrol-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'formcontrol-disabled',
        components: [
          {
            id: 'root',
            component: 'FormControl',
            disabled: true,
            children: ['fc-label', 'fc-input'],
          },
          {id: 'fc-label', component: 'FormControlLabel', text: 'Repository name'},
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
        ],
      },
    },
  ],
};
