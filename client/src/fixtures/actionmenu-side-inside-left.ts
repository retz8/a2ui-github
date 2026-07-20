import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideInsideLeftFixture: Fixture = menuFixture('actionmenu-side-inside-left', {
  open: true,
  overlayProps: {side: 'inside-left'},
});
