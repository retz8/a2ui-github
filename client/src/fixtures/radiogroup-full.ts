import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The complete stack together: Label + Caption + Validation(error) over the FormControl-wrapped
// radio option set — the deliberate all-slots-together completeness surface.
export const radiogroupFullFixture: Fixture = {
  name: 'radiogroup-full',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radiogroup-full', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radiogroup-full',
        components: [
          {
            id: 'root',
            component: 'RadioGroup',
            name: 'choices',
            children: ['rg-label', 'rg-caption', 'fc-one', 'fc-two', 'rg-validation'],
          },
          {id: 'rg-label', component: 'RadioGroupLabel', text: 'Choices'},
          {id: 'rg-caption', component: 'RadioGroupCaption', text: 'Select one option'},
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
            variant: 'error',
            text: 'Please select an option',
          },
        ],
      },
    },
  ],
};
