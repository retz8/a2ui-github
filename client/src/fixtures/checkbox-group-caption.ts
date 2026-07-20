import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// Label + helper Caption over the FormControl-wrapped option set.
export const checkboxGroupCaptionFixture: Fixture = {
  name: 'checkbox-group-caption',
  messages: [
    {version: 'v0.9', createSurface: {surfaceId: 'checkbox-group-caption', catalogId: CATALOG_ID}},
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-group-caption',
        components: [
          {
            id: 'root',
            component: 'CheckboxGroup',
            children: ['cg-label', 'cg-caption', 'fc-comments', 'fc-prs'],
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
        ],
      },
    },
  ],
};
