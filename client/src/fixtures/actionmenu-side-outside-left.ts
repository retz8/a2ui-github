import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuSideOutsideLeftFixture: Fixture = menuFixture(
  'actionmenu-side-outside-left',
  {open: true, overlayProps: {side: 'outside-left'}},
);
