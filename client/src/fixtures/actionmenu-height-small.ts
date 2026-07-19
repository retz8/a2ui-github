import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuHeightSmallFixture: Fixture = menuFixture('actionmenu-height-small', {
  open: true,
  overlayProps: {height: 'small'},
});
