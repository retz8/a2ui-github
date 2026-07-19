import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuWidthLargeFixture: Fixture = menuFixture('actionmenu-width-large', {
  open: true,
  overlayProps: {width: 'large'},
});
