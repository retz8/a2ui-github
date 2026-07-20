import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideInsideBottomFixture: Fixture = menuFixture(
  'actionmenu-side-inside-bottom',
  {open: true, overlayProps: {side: 'inside-bottom'}},
);
