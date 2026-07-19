import {CATALOG_ID} from 'primer-a2ui-adapter';
import type {Fixture} from './types';

// The family's shared DynamicString channel: CheckboxGroupLabel.text bound to /groupLabel. Pixels
// are identical to `checkbox-group`; the binding is proven in the render test, not baselined.
export const checkboxGroupLabelBoundFixture: Fixture = {
  name: 'checkbox-group-label-bound',
  messages: [
    {
      version: 'v0.9',
      createSurface: {surfaceId: 'checkbox-group-label-bound', catalogId: CATALOG_ID},
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId: 'checkbox-group-label-bound',
        components: [
          {
            id: 'root',
            component: 'CheckboxGroup',
            children: ['cg-label', 'fc-comments', 'fc-prs'],
          },
          {id: 'cg-label', component: 'CheckboxGroupLabel', text: {path: '/groupLabel'}},
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
        ],
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId: 'checkbox-group-label-bound',
        path: '/',
        value: {groupLabel: 'Notifications', comments: true, prs: false},
      },
    },
  ],
};
