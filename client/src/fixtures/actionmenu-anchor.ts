import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuAnchorFixture: Fixture = menuFixture('actionmenu-anchor', {
  open: true,
  trigger: [
    {id: 'trigger', component: 'ActionMenu.Anchor', child: 'kebab'},
    {
      id: 'kebab',
      component: 'IconButton',
      icon: 'kebab-icon',
      accessibility: {label: 'Open menu'},
      action: {
        functionCall: {
          call: 'consoleLog',
          args: {message: 'trigger (presentational)'},
          returnType: 'void',
        },
      },
    },
    {id: 'kebab-icon', component: 'Icon', name: 'kebab-horizontal', accessibility: {label: 'menu'}},
  ],
});
