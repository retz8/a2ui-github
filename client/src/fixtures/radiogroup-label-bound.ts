import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The family's shared DynamicString channel: RadioGroupLabel.text bound to /labelText. Pixels are
// identical to `radiogroup`; the binding is proven in the render test, not baselined.
export const radiogroupLabelBoundFixture: Fixture = {
  name: 'radiogroup-label-bound',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radiogroup-label-bound', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radiogroup-label-bound',
        components: [
          {
            id: 'root',
            component: 'RadioGroup',
            name: 'choices',
            children: ['rg-label', 'fc-one', 'fc-two'],
          },
          {id: 'rg-label', component: 'RadioGroupLabel', text: {path: '/labelText'}},
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
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'radiogroup-label-bound',
        path: '/',
        value: {labelText: 'Choices'},
      },
    },
  ],
};
