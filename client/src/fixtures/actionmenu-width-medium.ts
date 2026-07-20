import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuWidthMediumFixture: Fixture = menuFixture('actionmenu-width-medium', {
  open: true,
  overlayProps: {width: 'medium'},
});
