import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The complete stack together: Label + Caption + Validation(error) over the FormControl-wrapped
// option set — the deliberate all-slots-together completeness surface.
export const checkboxGroupFullFixture: Fixture = {
  name: 'checkbox-group-full',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox-group-full', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-group-full',
        components: [
          {
            id: 'root',
            component: 'CheckboxGroup',
            children: ['cg-label', 'cg-caption', 'fc-comments', 'fc-prs', 'cg-validation'],
          },
          {id: 'cg-label', component: 'CheckboxGroupLabel', text: 'Notifications'},
          {
            id: 'cg-caption',
            component: 'CheckboxGroupCaption',
            text: 'Choose which events email you',
          },
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
            variant: 'error',
            text: 'Select at least one option',
          },
        ],
      },
    },
  ],
};
