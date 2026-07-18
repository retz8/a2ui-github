import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery: one surface per validation variant — error and success — each Label + TextInput +
// FormControl.Validation.
const CASES = [
  {variant: 'error', message: 'That name is already taken'},
  {variant: 'success', message: 'Name is available'},
] as const;

function validationSurface(c: (typeof CASES)[number]): A2uiMessage[] {
  const surfaceId = `formcontrol-validation-${c.variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'FormControl',
            children: ['fc-label', 'fc-input', 'fc-validation'],
          },
          {id: 'fc-label', component: 'FormControlLabel', text: 'Repository name'},
          {id: 'fc-input', component: 'TextInput', value: 'octocat'},
          {
            id: 'fc-validation',
            component: 'FormControlValidation',
            variant: c.variant,
            text: c.message,
          },
        ],
      },
    },
  ];
}

export const formcontrolValidationFixture: Fixture = {
  name: 'formcontrol-validation',
  messages: CASES.flatMap(validationSurface),
};
