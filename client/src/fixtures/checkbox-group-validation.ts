import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {A2uiMessage} from '@a2ui/web_core/v0_9';
import type {Fixture} from './types';

// Gallery: one surface per validation variant — error and success — each Label + the
// FormControl-wrapped option set + CheckboxGroup.Validation.
const CASES = [
  {variant: 'error', message: 'Select at least one option'},
  {variant: 'success', message: 'Preferences saved'},
] as const;

function validationSurface(c: (typeof CASES)[number]): A2uiMessage[] {
  const surfaceId = `checkbox-group-validation-${c.variant}`;
  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: [
          {
            id: 'root',
            component: 'CheckboxGroup',
            children: ['cg-label', 'fc-comments', 'fc-prs', 'cg-validation'],
          },
          {id: 'cg-label', component: 'CheckboxGroupLabel', text: 'Notifications'},
          {
            id: 'fc-comments',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['cb-comments', 'lbl-comments'],
          },
          {id: 'cb-comments', component: 'Checkbox', checked: false},
          {id: 'lbl-comments', component: 'FormControlLabel', text: 'Comments'},
          {
            id: 'fc-prs',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['cb-prs', 'lbl-prs'],
          },
          {id: 'cb-prs', component: 'Checkbox', checked: false},
          {id: 'lbl-prs', component: 'FormControlLabel', text: 'Pull requests'},
          {
            id: 'cg-validation',
            component: 'CheckboxGroupValidation',
            variant: c.variant,
            text: c.message,
          },
        ],
      },
    },
  ];
}

export const checkboxGroupValidationFixture: Fixture = {
  name: 'checkbox-group-validation',
  messages: CASES.flatMap(validationSurface),
};
