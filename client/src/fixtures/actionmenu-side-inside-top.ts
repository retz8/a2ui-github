import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideInsideTopFixture: Fixture = menuFixture('actionmenu-side-inside-top', {
  open: true,
  overlayProps: {side: 'inside-top'},
});
