import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuAlignEndFixture: Fixture = menuFixture('actionmenu-align-end', {
  open: true,
  overlayProps: {align: 'end'},
});
