import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuTriggerIconFixture: Fixture = menuFixture('actionmenu-trigger-icon', {
  open: true,
  trigger: [
    {
      id: 'trigger',
      component: 'ActionMenu.Button',
      child: 'trigger-label',
      trailingVisual: 'caret',
    },
    {id: 'trigger-label', component: 'Text', text: 'Actions'},
    {id: 'caret', component: 'Icon', name: 'triangle-down', accessibility: {label: 'open'}},
  ],
});
