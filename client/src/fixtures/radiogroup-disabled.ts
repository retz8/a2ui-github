import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Root `disabled`: the group renders a disabled <fieldset>, which natively dims and disables every
// radio option inside it (Label + radios all dimmed).
export const radiogroupDisabledFixture: Fixture = {
  name: 'radiogroup-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radiogroup-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radiogroup-disabled',
        components: [
          {
            id: 'root',
            component: 'RadioGroup',
            name: 'choices',
            disabled: true,
            children: ['rg-label', 'fc-one', 'fc-two'],
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
        ],
      },
    },
  ],
};
