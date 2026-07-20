import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuAlignCenterFixture: Fixture = menuFixture('actionmenu-align-center', {
  open: true,
  overlayProps: {align: 'center'},
});
