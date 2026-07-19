import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Baseline assembly + interactive two-way write: a CheckboxGroup with a Label over three
// FormControl-wrapped Checkbox options (the realistic form shape — each option carries its own
// visible label via FormControl / FormControl.Label). Each option's `checked` is bound to a
// data-model path; clicking one writes the new state back through the binder's auto-generated setter.
export const checkboxGroupFixture: Fixture = {
  name: 'checkbox-group',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox-group', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-group',
        components: [
          {
            id: 'root',
            component: 'CheckboxGroup',
            children: ['cg-label', 'fc-comments', 'fc-prs', 'fc-mentions'],
          },
          {id: 'cg-label', component: 'CheckboxGroupLabel', text: 'Notifications'},
          {
            id: 'fc-comments',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['cb-comments', 'lbl-comments'],
          },
          {id: 'cb-comments', component: 'Checkbox', checked: {path: '/comments'}},
          {id: 'lbl-comments', component: 'FormControlLabel', text: 'Comments'},
          {
            id: 'fc-prs',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['cb-prs', 'lbl-prs'],
          },
          {id: 'cb-prs', component: 'Checkbox', checked: {path: '/prs'}},
          {id: 'lbl-prs', component: 'FormControlLabel', text: 'Pull requests'},
          {
            id: 'fc-mentions',
            component: 'FormControl',
            layout: 'horizontal',
            children: ['cb-mentions', 'lbl-mentions'],
          },
          {id: 'cb-mentions', component: 'Checkbox', checked: {path: '/mentions'}},
          {id: 'lbl-mentions', component: 'FormControlLabel', text: 'Mentions'},
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'checkbox-group',
        path: '/',
        value: {comments: true, prs: false, mentions: false},
      },
    },
  ],
};
