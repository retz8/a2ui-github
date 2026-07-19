import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Interaction (functionCall path): the group's `action` runs the registered consoleLog locally
// whenever the selection changes — proving path-1 (functionCall) fires from the group's onChange via
// RadioGroupContext, without any client->server dispatch.
export const radiogroupFnFixture: Fixture = {
  name: 'radiogroup-fn',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'radiogroup-fn', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'radiogroup-fn',
        components: [
          {
            id: 'root',
            component: 'RadioGroup',
            name: 'choices',
            action: {
              functionCall: {
                call: 'consoleLog',
                args: {message: 'radiogroup-fn changed'},
                returnType: 'void',
              },
            },
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
