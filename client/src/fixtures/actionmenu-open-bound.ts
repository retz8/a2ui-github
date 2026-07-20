import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuOpenBoundFixture: Fixture = menuFixture('actionmenu-open-bound', {
  open: {path: '/open'},
  dataModel: {open: true},
});
