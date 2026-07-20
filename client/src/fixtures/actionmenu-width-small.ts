import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuWidthSmallFixture: Fixture = menuFixture('actionmenu-width-small', {
  open: true,
  overlayProps: {width: 'small'},
});
