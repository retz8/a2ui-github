import {menuFixture} from './actionmenu-helpers';
import type {Fixture} from './types';

export const actionmenuWidthXxlargeFixture: Fixture = menuFixture('actionmenu-width-xxlarge', {
  open: true,
  overlayProps: {width: 'xxlarge'},
});
