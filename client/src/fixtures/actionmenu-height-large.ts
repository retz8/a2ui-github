import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuHeightLargeFixture: Fixture = menuFixture('actionmenu-height-large', {
  open: true,
  overlayProps: {height: 'large'},
});
