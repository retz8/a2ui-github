import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery: one surface per validation variant — error and success — each Label + the
// FormControl-wrapped radio options + RadioGroup.Validation.
const CASES = [
  {variant: 'error', message: 'Please select an option'},
  {variant: 'success', message: 'Looks good'},
] as const;

function validationSurface(c: (typeof CASES)[number]): A2uiMessage[] {
  const surfaceId = `radiogroup-validation-${c.variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'RadioGroup',
            name: 'choices',
            children: ['rg-label', 'fc-one', 'fc-two', 'rg-validation'],
          },
          {id: 'rg-label', component: 'RadioGroupLabel', text: 'Choices'},
          {
            id: 'fc-one',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['radio-one', 'lbl-one'],
          },
          {id: 'radio-one', component: 'Radio', value: 'one'},
          {id: 'lbl-one', component: 'FormControlLabel', text: 'Choice one'},
          {
            id: 'fc-two',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['radio-two', 'lbl-two'],
          },
          {id: 'radio-two', component: 'Radio', value: 'two'},
          {id: 'lbl-two', component: 'FormControlLabel', text: 'Choice two'},
          {
            id: 'rg-validation',
            component: 'RadioGroupValidation',
            variant: c.variant,
            text: c.message,
          },
        ],
      },
    },
  ];
}

export const radiogroupValidationFixture: Fixture = {
  name: 'radiogroup-validation',
  messages: CASES.flatMap(validationSurface),
};
