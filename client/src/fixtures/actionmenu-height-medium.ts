import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuHeightMediumFixture: Fixture = menuFixture('actionmenu-height-medium', {
  open: true,
  overlayProps: {height: 'medium'},
});
