import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideInsideCenterFixture: Fixture = menuFixture(
  'actionmenu-side-inside-center',
  {open: true, overlayProps: {side: 'inside-center'}},
);
