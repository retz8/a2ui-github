import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideInsideRightFixture: Fixture = menuFixture(
  'actionmenu-side-inside-right',
  {open: true, overlayProps: {side: 'inside-right'}},
);
