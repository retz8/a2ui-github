import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Baseline assembly: a RadioGroup with a Label over three FormControl-wrapped Radio options (the
// realistic form shape from the official doc — each option carries its own visible label via
// FormControl / FormControl.Label). One option is pre-selected. The radios carry no `name` of their
// own; they inherit the group's `name` (and its selection onChange) through RadioGroupContext.
export const radiogroupFixture: Fixture = {
  name: 'radiogroup',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radiogroup', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radiogroup',
        components: [
          {
            id: 'root',
            component: 'RadioGroup',
            name: 'choices',
            children: ['rg-label', 'fc-one', 'fc-two', 'fc-three'],
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
          {id: 'radio-two', component: 'Radio', value: 'two', checked: true},
          {id: 'lbl-two', component: 'FormControlLabel', text: 'Choice two'},
          {
            id: 'fc-three',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['radio-three', 'lbl-three'],
          },
          {id: 'radio-three', component: 'Radio', value: 'three'},
          {id: 'lbl-three', component: 'FormControlLabel', text: 'Choice three'},
        ],
      },
    },
  ],
};
