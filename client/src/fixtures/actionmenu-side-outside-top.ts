import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideOutsideTopFixture: Fixture = menuFixture('actionmenu-side-outside-top', {
  open: true,
  overlayProps: {side: 'outside-top'},
});
