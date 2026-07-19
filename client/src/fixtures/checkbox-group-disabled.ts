import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Root `disabled`: the group renders a disabled <fieldset>, which natively dims and disables every
// checkbox option inside it.
export const checkboxGroupDisabledFixture: Fixture = {
  name: 'checkbox-group-disabled',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox-group-disabled', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-group-disabled',
        components: [
          {
            id: 'root',
            component: 'CheckboxGroup',
            disabled: true,
            children: ['cg-label', 'fc-comments', 'fc-prs'],
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
        ],
      },
    },
  ],
};
