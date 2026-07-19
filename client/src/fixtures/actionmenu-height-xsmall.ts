import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuHeightXsmallFixture: Fixture = menuFixture('actionmenu-height-xsmall', {
  open: true,
  overlayProps: {height: 'xsmall'},
});
