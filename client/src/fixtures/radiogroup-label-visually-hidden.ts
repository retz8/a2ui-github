import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Label visuallyHidden: the legend is removed visually but stays in the accessibility tree; the
// radio options remain.
export const radiogroupLabelVisuallyHiddenFixture: Fixture = {
  name: 'radiogroup-label-visually-hidden',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'radiogroup-label-visually-hidden', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radiogroup-label-visually-hidden',
        components: [
          {
            id: 'root',
            component: 'RadioGroup',
            name: 'choices',
            children: ['rg-label', 'fc-one', 'fc-two'],
          },
          {id: 'rg-label', component: 'RadioGroupLabel', text: 'Choices', visuallyHidden: true},
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
