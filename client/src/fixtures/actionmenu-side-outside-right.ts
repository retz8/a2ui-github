import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideOutsideRightFixture: Fixture = menuFixture(
  'actionmenu-side-outside-right',
  {open: true, overlayProps: {side: 'outside-right'}},
);
